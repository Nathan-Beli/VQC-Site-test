const express = require('express');
const cors = require('cors');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
app.use(cors());

// Initialisation du bot Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// Route API pour les membres
app.get('/api/members', async (req, res) => {
    try {
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        if (!guild) {
            return res.status(404).json({ error: "Serveur non trouvé" });
        }

        await guild.members.fetch();
        const humanCount = guild.members.cache.filter(member => !member.user.bot).size;

        // Renvoie du JSON obligatoire pour fetch()
        res.json({ count: humanCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur serveur" });
    }
});

// Connexion au bot
client.login(process.env.DISCORD_TOKEN);

// Écoute sur le port fourni par Canner
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API lancée sur le port ${PORT}`));
