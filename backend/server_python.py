import json
import os
import sqlite3
from http.server import SimpleHTTPRequestHandler, HTTPServer
from urllib.parse import urlparse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "..", "database", "clinica_veterinaria.db")
FRONTEND_DIR = os.path.join(BASE_DIR, "..", "frontend")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

class VetCareHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=FRONTEND_DIR, **kwargs)

    def _send_json(self, data, status=200):
        body = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self._send_json({}, 200)

    def do_GET(self):
        parsed = urlparse(self.path)
        path = parsed.path

        if path == "/api/animais":
            conn = get_db()
            rows = conn.execute("""
                SELECT a.*, COUNT(s.id) AS total_servicos
                FROM animais a
                LEFT JOIN servicos s ON s.animal_id = a.id
                GROUP BY a.id
                ORDER BY a.nome ASC
            """).fetchall()
            conn.close()
            return self._send_json([dict(r) for r in rows])

        if path.startswith("/api/animais/") and path.endswith("/historico"):
            parts = path.split("/")
            animal_id = parts[3]
            conn = get_db()
            animal = conn.execute("SELECT * FROM animais WHERE id = ?", (animal_id,)).fetchone()
            if not animal:
                conn.close()
                return self._send_json({"erro": "Animal não encontrado."}, 404)
            servicos = conn.execute(
                "SELECT * FROM servicos WHERE animal_id = ? ORDER BY data_servico DESC, id DESC",
                (animal_id,)
            ).fetchall()
            conn.close()
            lista_serv = [dict(s) for s in servicos]
            total_gasto = sum(float(s.get("valor") or 0) for s in lista_serv)
            return self._send_json({
                "animal": dict(animal),
                "resumo": {
                    "total_atendimentos": len(lista_serv),
                    "valor_total_acumulado": total_gasto
                },
                "historico": lista_serv
            })

        if path == "/api/servicos":
            conn = get_db()
            rows = conn.execute("""
                SELECT s.*, a.nome AS animal_nome, a.especie, a.raca, a.tutor_nome
                FROM servicos s
                INNER JOIN animais a ON a.id = s.animal_id
                ORDER BY s.data_servico DESC, id DESC
            """).fetchall()
            conn.close()
            return self._send_json([dict(r) for r in rows])

        return super().do_GET()

    def do_POST(self):
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length).decode("utf-8") if length > 0 else "{}"
        payload = json.loads(raw)

        if self.path == "/api/animais":
            conn = get_db()
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO animais (nome, especie, raca, idade, peso, tutor_nome, tutor_telefone)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                payload.get("nome"), payload.get("especie"), payload.get("raca"),
                int(payload.get("idade") or 0), float(payload.get("peso") or 0),
                payload.get("tutor_nome"), payload.get("tutor_telefone", "")
            ))
            conn.commit()
            new_id = cur.lastrowid
            conn.close()
            payload["id"] = new_id
            return self._send_json(payload, 201)

        if self.path == "/api/servicos":
            conn = get_db()
            cur = conn.cursor()
            cur.execute("""
                INSERT INTO servicos (animal_id, tipo_servico, veterinario, data_servico, valor, observacoes)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                int(payload.get("animal_id")), payload.get("tipo_servico"),
                payload.get("veterinario"), payload.get("data_servico"),
                float(payload.get("valor") or 0), payload.get("observacoes", "")
            ))
            conn.commit()
            new_id = cur.lastrowid
            conn.close()
            payload["id"] = new_id
            return self._send_json(payload, 201)

        return self._send_json({"erro": "Rota não encontrada"}, 404)

if __name__ == "__main__":
    port = 3000
    server = HTTPServer(("0.0.0.0", port), VetCareHandler)
    print(f"Servidor rodando em http://localhost:{port}")
    server.serve_forever()
