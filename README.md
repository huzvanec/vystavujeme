# Vystavujeme

## O projektu

Toto je frontend dějepisného projektu osmi studentů [gymnázia Českolipská](https://ceskolipska.cz), kteří dostali za úkol zrekonstruovat výstavu _Čas zámořských objevů_ organizovanou Náprstkovým muzeem v roce 2013.
</br>
Tuto výstavu v našem podání si si můžete projít na svém počítači na https://vystavu.jeme.cz. Webová stránka bohužel nepodporuje dotyková zařízení.

## Kde je co?

- Originální modely se nacházejí v [/models](https://github.com/huzvanec/vystavujeme/tree/master/models).
- Kompresované modely (většinou použitím [add-model.sh](https://github.com/huzvanec/vystavujeme/blob/master/scripts/add-model.sh)) jsou v [/static/models](https://github.com/huzvanec/vystavujeme/tree/master/static/models).
- Texty k modelům se nacházejí v [/src/lib/texts](https://github.com/huzvanec/vystavujeme/tree/master/src/lib/texts), první řádek každého HTML souoru značí nadis a popisek každého modelu.

## Buildování

Tento projekt používá [pnpm](https://pnpm.io/).

```bash
git clone https://github.com/huzvanec/vystavujeme
pnpm build
```
