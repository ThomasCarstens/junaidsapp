

(base) txa@zone1:~/keys/appdolivier$ eas build -p android --profile playstore --local

(base) txa@zone1:~/keys/appdolivier$ eas credentials

(base) txa@zone1:~/keys/appdolivier$ java -jar pepk.jar --keystore=keystore.jks --alias=8ecb6fb947a5c1b4fefcbe7ba585727b --output=output.zip --include-cert --rsa-aes-encryption --encryption-key-path=./encryption_public_key.pem

see master branch for FCMv1 key

see master branch for some hours - 20sept : 1h30 security management / 40min email

21sept: 1h email


https://appstoreconnect.apple.com
https://developer.apple.com/
(base) txa@zone1: eas whoami / login mykeys

You don't have the required permissions to perform this operation.

This can sometimes happen if you are logged in as incorrect user.
Run eas whoami to check the username you are logged in as.
Run eas login to change the account.

Original error message: Entity not authorized: AppEntity[51e2e72b-ed5c-4f8d-bc3e-86e58c5e5370] (viewer = RegularUserViewerContext[c8f58066-ec9d-4cea-87b0-b900211a7128], action = READ, ruleIndex = -1)
Request ID: 9e61ffaa-0e01-4445-951e-814bedcd9346
    Error: GraphQL request failed.

https://play.google.com/console/u/0/signup
const [categoryOptions, setCategoryOptions] = useState([
 "Médecine Sport",
"Rhumatologie",
"Médecine Physique",
"Autre"
 ]);
const [lieuOptions, setLieuOptions] = useState([
"Nîmes GEMMLR",
"Toulouse AMOPY",
"Avignon ISTM",
"Autre"
 ]);
const [regionOptions, setRegionOptions] = useState([
"PACA",
"Occitanie",
"Île-de-France",
"Grand Est",
"Bretagne",
"Auvergne-Rhône-Alpes",
"Bourgogne-Franche-Comté",
"Centre-Val de Loire",
"Corse",
"Hauts-de-France",
"Normandie",
"Nouvelle-Aquitaine",
"Pays de la Loire",
"Loire-Atlantique",
"Autre"
 ]);
const [anneeOptions, setAnneeOptions] = useState([
"DIU 1",
"DIU 2",
"DIU 3",
"Postgraduate",
"Autre"
 ]);
const updateFilterOptions = (formationsArray) => {
 // We don't need to update the options from the formationsArray anymore
// as we're using predefined lists. However, we might want to keep track
// of which options are actually present in the data.
const presentCategories = new Set(formationsArray.map(f => f.domaine));
const presentLieux = new Set(formationsArray.map(f => f.lieu));
const presentRegions = new Set(formationsArray.map(f => f.region));
const presentAnnees = new Set(formationsArray.map(f => f.anneeConseillee));
console.log("Present categories:", presentCategories);
console.log("Present lieux:", presentLieux);
console.log("Present regions:", presentRegions);
console.log("Present annees:", presentAnnees);
// If you want to highlight or mark which options are actually present in the data,
// you can use these Sets to do so in your UI rendering logic.
 };
// const updateFilterOptions = (formationsArray) => {
// const categories = [...new Set(formationsArray.map(f => f.domaine))];
// const lieux = [...new Set(formationsArray.map(f => f.lieu))];
// const regions = [...new Set(formationsArray.map(f => f.region))];
// const annees = [...new Set(formationsArray.map(f => f.anneeConseillee))];
// console.log(categories)
// setCategoryOptions(categories);
// setLieuOptions(lieux);
// setRegionOptions(regions);
// setAnneeOptions(annees);
// };

Update RechercheFormationsScreen with filter options that have all the ones existing in our array plus any from the data

