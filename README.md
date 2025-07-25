# Web Shop - Frontend
Ovo je web aplikacija gde možete listati, pretraživati i kupovati proizvode.

 -Neulogovani korisnici mogu pretraživati i pregledati proizvode.

 -Ulogovani korisnici mogu dodati proizvode u korpu, poručiti proizvode, i pratiti status porudžbine u svom profilu (status porudžbine menja administrator). Kada korisnik kupi proizvode iz svoje korpe dobije obaveštenje na e-mail koje je artikle kupio.

 -Administrator može dodavati kategorije, izmeniti kategorije, dodati osobine kao i vršiti izmenu istih, dodati proizvode, vršiti izmenu proizvoda, dodati i brisati slike. Administrator takođe može pratiti porudžbine, prihvatiti, poslati ili odbiti porudžbinu.

# Pokretanje frontend aplikacije

Da biste uspešno pokrenuli projekat, pratite korake ispod.

# Tehnologije korišćene u projektu
- React
- JavaScript / TypeScript
- Node.js (za razvojni server)
- API komunikacija preko `API_URL` (backend na portu 3000)

# Verzija Node.js

Projekat je testiran na:
- Node.js v21.x
- NPM v10+

Ako je Node.js mnogo stariji — mogu nastati problemi pri instalaciji zavisnosti.


# Instalacija

Ako radite na Windows-u, `sudo` nije potreban.  
Samo koristite: npm install

# Pokretanje frontend-a

1. Klonirajte frontend repozitorijum:
git clone https://github.com/AnesKostreba/Iva-Front-End.git

2. Instalirajte zavisnosti:
npm install

6. Pokrenite frontend aplikaciju:
npm start

7. Frontend se pokreće na http://localhost:4000/  


## Povezivanje na backend

Frontend koristi `api.config.js` za API URL.

Proverite da je:
export const ApiConfig = {
    API_URL: 'http://localhost:3000/'
};

Backend mora biti pokrenut na portu 3000.

# Administrator nalog

- Stranica za login: http://localhost:4000/administrator/login
- Korisničko ime: `administrator`
- Lozinka: `administrator`


# Nedostatci aplikacije na kojima trenutno radim:
  1. Dodavanje proizvoda u korpu kada korisnik nije ulogovan.
  2. Sledeci linkovi u meniju nisu aktivni
      O nama
      Pitaj farmaceuta
      Blog
      Poslovnice
      Zaposlenje
      Kontakt
   3. Dodavanje novih banera na pocetnoj strani.
   