### Fakulta informatiky a informačných technológií STU

## 2022/23

## Aplikačné architektúry softvérových systémov - Semestrálny projekt

# SellPhone e-shop - microservices/event-driven architecture



Michal Sorát, Róbert Suchý, Adam Kotvan


## Cieľ a opis projektu
Cieľom semestrálneho projektu je vytvorenie architektúry webovej aplikácie - webstránky zameranej na internetový predaj mobilných zariadení (e-shop),
ktorou rozšírime už existujúci reťazec kamenných predajní. Jednotlivé obrazovky budú pozostávať z domovskej stránky, stránky zobrazujúcej konkrétnu
kategóriu mobilných zariadení s možnosťami filtrovania na základe kategórie či parametrov produktu, stránky obsahujúcej detail produktu a stránky pre
jednotlivé kroky nákupného košíka.

Databáza bude pozostávať z tabuliek užívateľov, produktov, ich parametrov, špecifikácií a súborových umiestnení obrázkov, objednávok, pričom medzi
produktami a objednávkami bude platiť vzťah M:N. Stránka bude umožňovať nákup jednotlivých produktov ich vložením do košíka, následným vybraním 
spôsobu dopravy a platby, vyplnením doručovacích údajov zákazníka s možnosťou prihlásenia a samotným odoslaním objednávky. Každý používateľ bude
mať k dispozícii možnosť vytvoriť si svoj vlastný používateľský účet, ktorý bude uchovávať obsah košíka v databáze, zobrazovať históriu objednávok
a umožňovať písanie recenzii.

Projekt okrem používateľského rozhrania má aj admin časť. V tejto časti je možné produkty upravovať, vytvárať, či mazať. Admin má takisto prehľad
o všetkých registrovaných používateľoch a vidí všetky vytvorené objednávky, ktoré opäť môže spravovať.

Tento repozitár sa zameriava implementáciu mikroslužieb a event-driven architektúry do projektu e-shopu.
