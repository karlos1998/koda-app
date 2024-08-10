### Przykładowy, testowy projekt dla KODA :)

Aby skonfigurować projekt należy użyć przykładowego pliku env, w którym są skonfigurowane już moje klucze dla AI i SERP.

Przejdź do katalogu projektu a następnie postępuj według podanych wskazówek

```
cp backend/.env.example backend/.env
```

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