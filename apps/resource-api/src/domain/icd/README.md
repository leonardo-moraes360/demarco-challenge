# Domínio ICD - Classificação Internacional de Doenças

Este domínio fornece integração com a API da OMS (Organização Mundial da Saúde) para buscar códigos CID (Classificação Internacional de Doenças).

## Configuração

### Variáveis de Ambiente

```bash
# ICD Configuration
ICD_API_URI=https://id.who.int/icd/entity
ICD_API_URI_FALLBACK=https://id.who.int/icd/entity
ICD_OAUTH_TOKEN_URI=https://icdaccessmanagement.who.int/connect/token
ICD_OAUTH_CLIENT_ID=your-icd-client-id
ICD_OAUTH_CLIENT_SECRET=your-icd-client-secret
ICD_OAUTH_SCOPE=icdapi_access
ICD_OAUTH_GRANT_TYPE=client_credentials
```

### Obter Credenciais

Para obter as credenciais da API da OMS:

1. Acesse: https://icd.who.int/icdapi
2. Registre-se para obter um Client ID e Client Secret
3. Configure as variáveis de ambiente com suas credenciais

## Endpoints

### Buscar CIDs

```
GET /api/v1/icd
```

**Parâmetros de Query:**

- `q` (string, opcional): Termo de busca
- `id` (string, opcional): Código CID específico
- `icdVersion` (string, opcional): Versão do ICD (10 ou 11)
- `propertiesToBeSearched` (string, opcional): Propriedades para busca
- `propertiesToBeSearchedIn` (string, opcional): Propriedades na resposta
- `language` (string, opcional): Linguagem (padrão: pt)
- `limit` (number, opcional): Limite de resultados (1-100, padrão: 10)
- `offset` (number, opcional): Offset para paginação (padrão: 0)
- `entityType` (string, opcional): Tipo de entidade
- `linearization` (string, opcional): Linearização

**Exemplo de uso:**

```bash
curl "http://localhost:3000/api/v1/icd?q=diabetes&limit=5&language=pt"
```

### Buscar CID Específico

```
GET /api/v1/icd/{id}
```

**Exemplo de uso:**

```bash
curl "http://localhost:3000/api/v1/icd/123456789"
```

## Exemplos de Resposta

### Busca de CIDs

```json
{
  "entities": [
    {
      "id": "123456789",
      "title": "Diabetes mellitus tipo 1",
      "definition": "Diabetes mellitus caracterizado por deficiência absoluta de insulina",
      "idCode": "E10",
      "icdVersion": "10",
      "entityType": "category",
      "classification": "ICD-10"
    }
  ],
  "totalCount": 150,
  "offset": 0,
  "limit": 10
}
```

### CID Específico

```json
{
  "id": "123456789",
  "title": "Diabetes mellitus tipo 1",
  "definition": "Diabetes mellitus caracterizado por deficiência absoluta de insulina",
  "idCode": "E10",
  "icdVersion": "10",
  "entityType": "category",
  "classification": "ICD-10",
  "exclusion": "Diabetes mellitus tipo 2 (E11)",
  "inclusion": "Diabetes mellitus tipo 1 com complicações",
  "note": "Incluir complicações quando especificadas",
  "synonyms": ["DM1", "Diabetes tipo 1"],
  "relatedTerms": ["Insulina", "Glicemia"]
}
```

## Autenticação e Headers

O sistema utiliza OAuth 2.0 Client Credentials para autenticar com a API da OMS:

1. **Token Management**: Tokens são gerenciados automaticamente
2. **Cache**: Tokens são armazenados em cache com expiração
3. **Renovação**: Tokens são renovados automaticamente quando necessário
4. **Fallback**: Sistema de fallback para URLs alternativas

### Headers Automáticos

O sistema adiciona automaticamente os seguintes headers:

- `Authorization: Bearer {token}` - Token de autenticação
- `Accept: application/json` - Formato de resposta
- `Accept-Language: pt` - Idioma português
- `API-Version: v2` - Versão da API da OMS

## Tratamento de Erros

- **401 Unauthorized**: Credenciais inválidas ou token expirado
- **400 Bad Request**: Parâmetros de busca inválidos
- **404 Not Found**: CID não encontrado
- **500 Internal Server Error**: Erro interno do servidor

## Logs

O sistema registra logs detalhados para:

- Autenticação com a API da OMS
- Requisições de busca
- Erros de comunicação
- Renovação de tokens

## Cache

- **Tokens**: Cache de 1 hora (com margem de 5 minutos)
- **Resultados**: Não há cache de resultados (sempre busca na API da OMS)
- **Configuração**: Cache global configurado no módulo principal
