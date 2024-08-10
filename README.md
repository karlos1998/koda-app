### Przykładowy, testowy projekt dla KODA :)

Przejdź do katalogu projektu a następnie postępuj według podanych wskazówek

```
cp backend/.env.example backend/.env
```

W utworzonym pliku .env wpisz wymagane klucze API dla OpenAI + serpAPI

```
npm run start
```

Teraz nasza aplikacja jest już uruchomiona.
Backend działą na porcie 3000, a frontend w środowisku dev na porcie 5173.

Status działania backendu mamy tutaj: http://localhost:3000/health

Docelowa aplikacja widoczna powinna być tu:

http://localhost:5173/


Aplikacja nie jest przygotowana pod środowisko produkcyjne, ani docker-compose. 
W razie potrzeby, oczywyścię mogę zrobić wszystko na gotowo ;)