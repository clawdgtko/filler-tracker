/**
 * 📺 Shows Database
 * Filler guides for TV shows and anime
 */

export const SHOWS_DB = {
  'stargate-sg1': {
    tmdbId: 4629,
    guides: {
      fr: {
        s1: [
          { ep: 1, type: "must-watch", note: "Pilote - Introduction complète" },
          { ep: 2, type: "optional", note: "Kawalsky possédé" },
          { ep: 3, type: "skip", note: "Épisode très faible" },
          { ep: 4, type: "important", note: "Introduction du Dr Fraiser" },
          { ep: 5, type: "optional", note: "Filler planète" },
          { ep: 6, type: "important", note: "Passé familial Jack" },
          { ep: 7, type: "optional", note: "Race ancienne" },
          { ep: 8, type: "must-watch", note: "Excellente histoire" },
          { ep: 9, type: "important", note: "Première mention Thor" },
          { ep: 10, type: "optional", note: "Intéressant" },
          { ep: 11, type: "important", note: "Teal'c famille" },
          { ep: 12, type: "optional", note: "Daniel capturé" },
          { ep: 13, type: "skip", note: "Le pire épisode" },
          { ep: 14, type: "must-watch", note: "Cassandra - arc important" },
          { ep: 15, type: "optional", note: "Procès Teal'c" },
          { ep: 16, type: "optional", note: "Les Tollans" },
          { ep: 17, type: "must-watch", note: "Jack & Carter Antarctique" },
          { ep: 18, type: "important", note: "Équipe dupliquée" },
          { ep: 19, type: "must-watch", note: "Réalité alternative" },
          { ep: 20, type: "skip", note: "Clip show" },
          { ep: 21, type: "must-watch", note: "Finale saison 1" }
        ]
      }
    }
  },
  'stargate-atlantis': {
    tmdbId: 2290,
    name: 'Stargate Atlantis',
    description: 'Une équipe militaire et scientifique explore la cité perdue des Anciens dans une autre galaxie et fait face à un nouvel ennemi mortel : les Wraiths.',
    totalEpisodes: 100,
    seasons: 5,
    year: '2004-2009',
    guides: {
      fr: {
        s1: [
          { ep: 1, type: "must-watch", note: "Rising (Part 1) - Découverte d'Atlantis" },
          { ep: 2, type: "must-watch", note: "Rising (Part 2) - Premiers pas dans la cité" },
          { ep: 3, type: "must-watch", note: "Hide and Seek - Découverte des Anciens" },
          { ep: 4, type: "must-watch", note: "Thirty-Eight Minutes - Porte bloquée" },
          { ep: 5, type: "important", note: "Suspicion - Introduction des Athosiens" },
          { ep: 6, type: "must-watch", note: "Childhood's End - Mystère planète étrange" },
          { ep: 7, type: "important", note: "Poisoning the Well - Premier contact Wraiths" },
          { ep: 8, type: "must-watch", note: "Underground - Alliance avec les Genii" },
          { ep: 9, type: "important", note: "Home - Retour sur Terre temporaire" },
          { ep: 10, type: "must-watch", note: "The Storm - Début arc tempête" },
          { ep: 11, type: "must-watch", note: "The Eye - Dernier combat tempête" },
          { ep: 12, type: "important", note: "The Defiant One - Ancient rebelle" },
          { ep: 13, type: "must-watch", note: "Hot Zone - Virus Ancient se répand" },
          { ep: 14, type: "optional", note: "Sanctuary - Protection planète primitive" },
          { ep: 15, type: "important", note: "Before I Sleep - Flashbacks Anciens" },
          { ep: 16, type: "must-watch", note: "The Brotherhood - Recherche ZPM" },
          { ep: 17, type: "important", note: "Letters from Pegasus - Messages vers Terre" },
          { ep: 18, type: "important", note: "The Gift - Teyla développe ses pouvoirs" },
          { ep: 19, type: "must-watch", note: "The Siege (Part 1) - Wraiths attaquent" },
          { ep: 20, type: "must-watch", note: "The Siege (Part 2) - Bataille pour Atlantis" }
        ],
        s2: [
          { ep: 1, type: "must-watch", note: "The Siege (Part 3) - Renforts arrivent" },
          { ep: 2, type: "important", note: "The Intruder - Virus dans le système" },
          { ep: 3, type: "must-watch", note: "Runner - Introduction de Ronon Dex" },
          { ep: 4, type: "optional", note: "Duet - McKay partagé (comédie)" },
          { ep: 5, type: "important", note: "Condemned - Planète prison" },
          { ep: 6, type: "must-watch", note: "Trinity - Technologie Ancient dangereuse" },
          { ep: 7, type: "important", note: "Instinct - Rencontre avec une Wraith" },
          { ep: 8, type: "must-watch", note: "Conversion - Sheppard transformé" },
          { ep: 9, type: "important", note: "Aurora - Vaisseau Ancient abandonné" },
          { ep: 10, type: "must-watch", note: "The Lost Boys - Ford retrouvé" },
          { ep: 11, type: "must-watch", note: "The Hive - Infiltration Wraith" },
          { ep: 12, type: "optional", note: "Epiphany - Dimension temps alternatif" },
          { ep: 13, type: "important", note: "Critical Mass - Bombe sur Atlantis" },
          { ep: 14, type: "important", note: "Grace Under Pressure - McKay sous l'eau" },
          { ep: 15, type: "must-watch", note: "The Tower - Autre cité Ancient" },
          { ep: 16, type: "important", note: "The Long Goodbye - Esprits Anciens" },
          { ep: 17, type: "important", note: "Coup D'etat - Coup d'État Genii" },
          { ep: 18, type: "must-watch", note: "Michael - Retour du Wraith" },
          { ep: 19, type: "must-watch", note: "Inferno - Planète volcan" },
          { ep: 20, type: "must-watch", note: "Allies - Alliance dangereuse Wraiths" }
        ],
        s3: [
          { ep: 1, type: "must-watch", note: "No Man's Land - Bataille spatiale" },
          { ep: 2, type: "must-watch", note: "Misbegotten - Colonie Wraith humaine" },
          { ep: 3, type: "optional", note: "Irresistible - Homme charismatique" },
          { ep: 4, type: "must-watch", note: "Sateda - Planète de Ronon" },
          { ep: 5, type: "must-watch", note: "Progeny - Les Asurans (Réplicateurs)" },
          { ep: 6, type: "important", note: "The Real World - Réalité altérée" },
          { ep: 7, type: "must-watch", note: "Common Ground - Sheppard et Wraith" },
          { ep: 8, type: "important", note: "McKay and Mrs. Miller - Sœur de McKay" },
          { ep: 9, type: "important", note: "Phantoms - Hallucinations" },
          { ep: 10, type: "must-watch", note: "The Return (Part 1) - Anciens reprennent Atlantis" },
          { ep: 11, type: "must-watch", note: "The Return (Part 2) - Équipe exile" },
          { ep: 12, type: "important", note: "Echoes - Hallucinations collectives" },
          { ep: 13, type: "optional", note: "Irresponsible - Suite Irresistible" },
          { ep: 14, type: "important", note: "Tao of Rodney - Rodney surhumain" },
          { ep: 15, type: "must-watch", note: "The Game - Jeu de stratégie réel" },
          { ep: 16, type: "important", note: "The Ark - Réfugiés en cryogénie" },
          { ep: 17, type: "important", note: "Sunday - Épisode émouvant Dr Beckett" },
          { ep: 18, type: "must-watch", note: "Submersion - Atlantis sous l'eau" },
          { ep: 19, type: "must-watch", note: "Vengeance - Michaël crée des hybrides" },
          { ep: 20, type: "must-watch", note: "First Strike - Attaque sur Atlantis" }
        ],
        s4: [
          { ep: 1, type: "must-watch", note: "Adrift - Atlantis perdue dans l'espace" },
          { ep: 2, type: "must-watch", note: "Lifeline - Weir et les Réplicateurs" },
          { ep: 3, type: "must-watch", note: "Reunion - Carter rejoint l'équipe" },
          { ep: 4, type: "important", note: "Doppelganger - Créature cauchemardesque" },
          { ep: 5, type: "important", note: "Travelers - Nouvelle faction humaine" },
          { ep: 6, type: "important", note: "Tabula Rasa - Amnésie collective" },
          { ep: 7, type: "optional", note: "Missing - Teyla et Keller enlevées" },
          { ep: 8, type: "important", note: "The Seer - Prophétie destruction Atlantis" },
          { ep: 9, type: "important", note: "Miller's Crossing - Société secrète" },
          { ep: 10, type: "must-watch", note: "This Mortal Coil - Équipe découverte clone" },
          { ep: 11, type: "must-watch", note: "Be All My Sins Remember'd - Alliance anti-Réplicateurs" },
          { ep: 12, type: "important", note: "Spoils of War - Technologie Wraith" },
          { ep: 13, type: "optional", note: "Quarantine - Lockdown Atlantis" },
          { ep: 14, type: "optional", note: "Harmony - Aventure jeune princesse" },
          { ep: 15, type: "important", note: "Outcast - Retour Terre Sheppard" },
          { ep: 16, type: "optional", note: "Trio - McKay Carter Keller coincés" },
          { ep: 17, type: "must-watch", note: "Midway - Station midway attaquée" },
          { ep: 18, type: "must-watch", note: "The Kindred (Part 1) - Michaël enlève Teyla" },
          { ep: 19, type: "must-watch", note: "The Kindred (Part 2) - Recherche Teyla" },
          { ep: 20, type: "must-watch", note: "The Last Man - Sheppard dans le futur" }
        ],
        s5: [
          { ep: 1, type: "must-watch", note: "Search and Rescue - Sauvetage Teyla" },
          { ep: 2, type: "important", note: "The Seed - Infection alien" },
          { ep: 3, type: "important", note: "Broken Ties - Ronon brainwashé" },
          { ep: 4, type: "important", note: "The Daedalus Variations - Univers parallèle" },
          { ep: 5, type: "must-watch", note: "Ghost in the Machine - Anciens contrôlent Atlantis" },
          { ep: 6, type: "important", note: "The Shrine - McKay perd la mémoire" },
          { ep: 7, type: "important", note: "Whispers - Monstres dans le brouillard" },
          { ep: 8, type: "important", note: "The Queen - Teyla Reine Wraith" },
          { ep: 9, type: "optional", note: "Tracker - Chasse à l'homme" },
          { ep: 10, type: "must-watch", note: "First Contact - Découverte Janus" },
          { ep: 11, type: "must-watch", note: "The Lost Tribe - Bataille finale" },
          { ep: 12, type: "important", note: "Outsiders - Conflit Genii" },
          { ep: 13, type: "optional", note: "Inquisition - Teyla jugée" },
          { ep: 14, type: "must-watch", note: "The Prodigal - Michaël attaque Atlantis" },
          { ep: 15, type: "important", note: "Remnants - Vestiges Ancient" },
          { ep: 16, type: "optional", note: "Brain Storm - Conférence scientifique" },
          { ep: 17, type: "important", note: "Infection - Virus Wraith" },
          { ep: 18, type: "optional", note: "Identity - Changement de corps" },
          { ep: 19, type: "important", note: "Vegas - Univers alternatif" },
          { ep: 20, type: "must-watch", note: "Enemy at the Gate - Série finale" }
        ]
      }
    }
  },
  'breaking-bad': {
    tmdbId: 1396,
    guides: {
      fr: {
        s1: [
          { ep: 1, type: "must-watch", note: "Pilot - Le début de tout" },
          { ep: 2, type: "must-watch", note: "Cat's in the Bag..." },
          { ep: 3, type: "must-watch", note: "...And the Bag's in the River" },
          { ep: 4, type: "important", note: "Cancer Man" },
          { ep: 5, type: "must-watch", note: "Gray Matter" },
          { ep: 6, type: "must-watch", note: "Crazy Handful of Nothin'" },
          { ep: 7, type: "must-watch", note: "A No-Rough-Stuff-Type Deal" }
        ]
      }
    }
  },
  'naruto': {
    tmdbId: 46260,
    guides: {
      fr: {
        s1: [
          { ep: 1, type: "must-watch", note: "Pilote - Introduction de Naruto" },
          { ep: 2, type: "must-watch", note: "Introduction de Konohamaru" },
          { ep: 3, type: "optional", note: "Développement relation" },
          { ep: 4, type: "optional", note: "Test de survie" },
          { ep: 5, type: "must-watch", note: "Décision de Kakashi" },
          { ep: 6, type: "must-watch", note: "Début arc Land of Waves" },
          { ep: 7, type: "must-watch", note: "Zabuza apparaît" },
          { ep: 8, type: "must-watch", note: "Combat Naruto vs Zabuza" },
          { ep: 9, type: "must-watch", note: "Kakashi Sharingan" },
          { ep: 10, type: "must-watch", note: "Suite combat" },
          { ep: 11, type: "must-watch", note: "Histoire de Haku" },
          { ep: 12, type: "must-watch", note: "Combat final" },
          { ep: 13, type: "must-watch", note: "Secret de Haku" },
          { ep: 14, type: "must-watch", note: "Naruto se bat" },
          { ep: 15, type: "must-watch", note: "Suite combat" },
          { ep: 16, type: "must-watch", note: "Kyubi se réveille" },
          { ep: 17, type: "must-watch", note: "Passé de Haku" },
          { ep: 18, type: "must-watch", note: "Mort de Haku et Zabuza" },
          { ep: 19, type: "must-watch", note: "Fin arc Land of Waves" },
          { ep: 20, type: "must-watch", note: "Début examen Chunin" },
          { ep: 36, type: "optional", note: "Filler" },
          { ep: 64, type: "skip", note: "Filler - Arc Hokage Battle Royale" },
          { ep: 65, type: "skip", note: "Filler - Arc Hokage Battle Royale" },
          { ep: 97, type: "skip", note: "Filler" },
          { ep: 98, type: "skip", note: "Filler" },
          { ep: 102, type: "skip", note: "Filler arc Tea" },
          { ep: 136, type: "skip", note: "Filler" },
          { ep: 220, type: "must-watch", note: "Fin Naruto - Début Shippuden" }
        ]
      }
    }
  },
  'one-piece': { tmdbId: 37854 },
  'bleach': { tmdbId: 30984 },
  'attack-on-titan': { tmdbId: 1429 },
  'my-hero-academia': { tmdbId: 65930 },
  'demon-slayer': { tmdbId: 85937 },
  'dragon-ball-z': { tmdbId: 12971 },
  'death-note': { tmdbId: 13916 },
  'fullmetal-alchemist-brotherhood': { tmdbId: 31911 },
  'hunter-x-hunter': { tmdbId: 46298 },
  'jujutsu-kaisen': { tmdbId: 90462 }
};

export default SHOWS_DB;
