require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Autorise le site à lire la donnée

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers
    ]
});

// Le token récupère les membres et les envoie au site sous format JSON
app.get('/api/members', async (req, res) => {
    try {
        const guild = client.guilds.cache.get(process.env.GUILD_ID);
        if (!guild) return res.status(404).json({ error: "Serveur introuvable" });

        await guild.members.fetch();
        const humanCount = guild.members.cache.filter(m => !m.user.bot).size;

        res.json({ count: humanCount });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la récupération" });
    }
});

client.login(process.env.DISCORD_TOKEN);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API démarrée sur le port ${PORT}`));
