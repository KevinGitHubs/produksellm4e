import axios from 'axios';

export async function sendDiscordRedeem(username: string, phone: string, coin: number, dana: number) {
  const webhook = process.env.DISCORD_WEBHOOK!;
  const embed = {
    title: '🎉 Penukaran M4E Berhasil!',
    color: 0x00ff00,
    thumbnail: { url: 'https://i.ibb.co/6r1vG6w/m4e-logo.png' },
    fields: [
      { name: '👤 Username', value: username, inline: true },
      { name: '📞 Nomor WA', value: phone, inline: true },
      { name: '🪙 Koin Dipakai', value: `${coin.toLocaleString()} M4E`, inline: true },
      { name: '💰 Saldo Dana', value: `Rp ${dana.toLocaleString()}`, inline: true },
    ],
    footer: { text: 'M4E Gameathon - Vercel' },
    timestamp: new Date(),
  };
  await axios.post(webhook, { embeds: [embed] });
}
