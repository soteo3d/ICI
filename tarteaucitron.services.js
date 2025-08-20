
// Fichier : tarteaucitron.services.js

tarteaucitron.services.googlemaps = {
    "key": "googlemaps",
    "type": "api",
    "name": "Google Maps",
    "uri": "https://policies.google.com/privacy",
    "needConsent": true,
    "cookies": ['NID', 'CONSENT'],
    "js": function () {
        "use strict";
        // On cherche le conteneur que nous avons défini dans le HTML
        var container = document.getElementById('google-map-placeholder');
        if (!container) return;

        // On crée l'iframe nous-mêmes
        var iframe = document.createElement('iframe');
        
        // --- REMPLACEZ LE LIEN CI-DESSOUS PAR VOTRE VRAI LIEN D'INTÉGRATION ---
        iframe.src = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2903.7116949707256!2d-0.37222168705786596!3d43.29935897512231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd5648ce03ca12d9%3A0x24b8ca9edf4afbdc!2sComplexe%20de%20la%20R%C3%A9publique!5e0!3m2!1sfr!2sfr!4v1755712823179!5m2!1sfr!2sfr"; 
        
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.border = '0';
        iframe.setAttribute('allowfullscreen', '');
        iframe.setAttribute('loading', 'lazy');

        // On vide le conteneur et on y ajoute notre iframe
        container.innerHTML = '';
        container.appendChild(iframe);
    }
};
