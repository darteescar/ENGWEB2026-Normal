import json
import sys

INPUT  = '../jogos.json'
OUTPUT = 'jogos_import.json'

with open(INPUT, encoding='utf-8') as f:
    jogos = json.load(f)

for jogo in jogos:
    jogo['_id'] = jogo['id']   # usar o id slug como _id do Mongo
    # premios vazio fica como lista vazia []

with open(OUTPUT, 'w', encoding='utf-8') as f:
    json.dump(jogos, f, ensure_ascii=False, indent=2)

print(f'Gerado {OUTPUT} com {len(jogos)} jogos.')
