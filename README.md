<img src="img/image.png" alt="logo" width="200"/>

# My Wallet Api

Backend do My Wallet, responsável por tratar o cadastro, login e guardar os registros da carteira num banco PostgreSQL para depois retornar pro front

## Features

✅ Cadastrar

✅ Logar/Deslogar

✅ Adicionar uma entrada ou saída de dinheiro

✅ Retornar os registros da carteira

## O que é a API?

A API do My Wallet é composta pelas seguintes rotas:

- **POST `/api/users/sign-up`**

    Cria novo usuário no banco guardando a senha encriptada . Espera Json no formato

    ```json
    {
      "name": "Foo Baa",
      "email": "foobaa@fb.com",
      "password": "foobaa",
      "passwordConfirmation": "foobaa"
    }
    ```
    - Validação
        - Todos os campos são obrigatórios
        - `name` é uma string com padrão Nome Sobrenome, min 5 e max 15 caracteres
        - `email` deve ter o formato de um email Ex: nome@nome.com
        - `password` é uma string com min 6 e max 12 caracteres
        - `passwordConfirmation` deve ser igual a `password`

- **POST `/api/users/sign-in`**

    Cria sessão do usuário no banco e retorna um token. Espera Json no formato

    ```json
    {
      "email": "foobaa@fb.com",
      "password": "foobaa"
    }
    ```

- **POST `/api/users/sign-out`**

    Apaga sessão do usuário no banco. Espera header de autenticação com o token, Ex: Beaerer 20bcd90e-4eda-4be7-9ddf-e995df4bc6a0

- **POST `/api/records`**

    Adiciona uma transação do usuário ao banco, precisa de autenticação (olhar POST signOut). Espera Json no formato
    
    ```json
    {
      "transaction": "25",
      "description": "allowance",
      "type":"income"
    }
    ```
    - Validação
        - Todos os campos são obrigatórios
        - `transaction` é um número, min 0
        - `description` é uma string, max 18 caracteres
        - `type` só aceita 2 strings, 'expense' ou 'income'

- **GET `/api/records`**

    Retorna todas as transações do banco relacionadas ao usuário autenticado. A resposta deve ter o formato:
    
    ```json 
    [
      {
        "userId":9,
        "type":"income",
        "id":30,
        "date":"2021-03-05T00:00:00.000Z",
        "description":"allowance",
        "transaction":"R$ 25,00"
      },
      {
       "userId":9,
       "type":"expense",
       "id":31,
       "date":"2021-03-05T00:00:00.000Z",
       "description":"Ligue of legends RP",
       "transaction":"R$ 15,90"
      }
    ]
    ```

## Como rodar o projeto?

1. Instale o NodeJS [https://nodejs.org/en/](https://nodejs.org/en/)
2. Instale o Postgres 13 [https://www.postgresql.org/](https://www.postgresql.org/)
3. Crie uma nova database

    ```bash
    $ psql
    $ CREATE DATABASE minha_nova_database;
    ```
4. Crie as tabelas no banco
    ```bash
    CREATE TABLE public.records
    (
        "userId" integer NOT NULL,
        type character varying COLLATE pg_catalog."default" NOT NULL,
        id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
        date date NOT NULL,
        description character varying COLLATE pg_catalog."default" NOT NULL,
        transaction money NOT NULL,
        CONSTRAINT records_pkey PRIMARY KEY (id)
    )

    TABLESPACE pg_default;

    ALTER TABLE public.records
        OWNER to postgres;
    --------------------------------------------------
        CREATE TABLE public.sessions
    (
        "userId" integer NOT NULL,
        token character varying COLLATE pg_catalog."default" NOT NULL,
        CONSTRAINT sessions_pkey PRIMARY KEY (token)
    )

    TABLESPACE pg_default;

    ALTER TABLE public.sessions
        OWNER to tjuwnshjovtvzg;
    ---------------------------------------------------

    CREATE TABLE public.users
    (
        id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
        name character varying COLLATE pg_catalog."default" NOT NULL,
        email character varying COLLATE pg_catalog."default" NOT NULL,
        password character varying COLLATE pg_catalog."default" NOT NULL,
        CONSTRAINT users_pkey PRIMARY KEY (id),
        CONSTRAINT email_unique UNIQUE (email)
    )

    TABLESPACE pg_default;

    ALTER TABLE public.users
        OWNER to tjuwnshjovtvzg;
    ```

4. Clone o projeto
5. Crie o arquivo .env a partir do arquivo .env.example e preencha os valores com a url para a database criada e a porta a ser usada.
6. Instale as dependências

    ```bash
    npm i
    ```

7. Rode as migrations

    ```bash
    npx sequilize-cli db:migrate
    ```

8. Rode a aplicação 🙂

    ```bash
    npm run dev
    ```
