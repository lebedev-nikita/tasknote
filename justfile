schema-apply:
  npx dotenv -- pgschema apply --file db/schema.sql

prettier-write:
  npx prettier --cache --write .

typecheck-client:
  cd client && npm run typecheck
typecheck-server:
  cd server && npm run typecheck

typecheck: typecheck-server typecheck-client