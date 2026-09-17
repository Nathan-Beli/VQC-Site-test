require('dotenv').config(); // Permet de lire le fichier .env en local
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Autorise ton site web à lire l'API

// Initialisation du bot Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers // Nécessaire pour compter les membres
    ]
});

// Route API pour récupérer le nombre de membres sans les bots
app.get('/api/members', async (req, res) => {
    try {
        const guildId = process.env.GUILD_ID; // ID de ton serveur Discord
        const guild = client.guilds.cache.get(guildId);
        
        if (!guild) {
            return res.status(404).json({ error: "Serveur Discord non trouvé" });
        }

        // Récupère la liste à jour des membres
        await guild.members.fetch();

        // Filtre pour ne garder que les membres qui NE SONT PAS des bots
        const humanCount = guild.members.cache.filter(member => !member.user.bot).size;

        res.json({ count: humanCount });
    } catch (error) {
        console.error("Erreur API:", error);
        res.status(500).json({ error: "Erreur lors du comptage des membres" });
    }
});

client.once('ready', () => {
    console.log(`Bot connecté sous le nom de ${client.user.tag}`);
});

// Connexion du bot avec le Token depuis les variables d'environnement
client.login(process.env.DISCORD_TOKEN);

// Démarrage de l'API web
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur API lancé sur le port ${PORT}`));
