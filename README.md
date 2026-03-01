# Node.js GOAT

Node.js 환경에서 발생 가능한 취약점 유형들을 실습할 수 있는 Docker 기반 환경입니다.

## Requirements

- Docker
- Docker Compose
- Web Proxy Tool (Burp Suite)

## 실행

```bash
git clone https://github.com/KR-mick3y/node.js-GOAT.git
cd node.js-GOAT
docker-compose up --build -d
```

## 종료

```bash
docker-compose down
```

## Labs

| # | 취약점 | URL |
|---|--------|-----|
| 01 | Prototype Pollution | http://localhost:4001 |
| 02 | Command Injection | http://localhost:4002 |
| 03 | Path Traversal | http://localhost:4003 |
| 04 | SSTI (EJS Injection) | http://localhost:4004 |
| 05 | SSRF | http://localhost:4005 |
| 06 | Admin Privilege Escalation | http://localhost:4007 |

## 버전

| 버전 | 날짜 | 내용 |
|------|------|------|
| v0.1 | 2026-03-01 | 최초 배포 |
