import fetch from 'node-fetch';
import { writeFileSync, } from 'fs'

const emojis = {
  ":s": "vip/stupid.gif",
  ":r": "vip/unsure.gif",
  ":u": "vip/sleep.gif",
  "(h)": "vip/ninja.gif",
  ":p": "vip/sick.gif",
  "(he)": "vip/hehe.gif",
  ":(": "vip/sad.gif",
  ":d": "vip/lauth.gif",
  ":)": "vip/smile.gif",
  ":f": "vip/huh.gif",
  "(n)": "vip/tombdown.gif",
  ":g": "vip/offended.gif",
  "@-}-": "vip/blomst.gif",
  "(c)": "vip/fika.gif",
  ":X": "vip/love17.gif",
  "(6)": "vip/devil.gif",
  ":L": "vip/pressed.gif",
  "(g)": "vip/shout.gif",
  "(hi)": "vip/hello.gif",
  ":s)": "vip/see.gif",
  "(m)": "vip/note.gif",
  "(w)": "vip/wacko.gif",
  ":B": "vip/blush.gif",
  "(i)": "vip/bulb.gif",
  "(y)": "vip/tombup.gif",
  ";)": "vip/wink.gif",
  ";(": "vip/cry.gif",
  "o:)": "vip/angel.gif",
  "(:v)": "vip/broken_heart.gif",
  "(k)": "vip/good.gif",
  "(s)": "vip/hart.gif",
};

for (const [key, value] of Object.entries(emojis)) {
   fetch(`http://chat.suomi24.fi/img/${value}`).then(res => res.arrayBuffer()).then(ab => {
    const buffer = Buffer.from(ab)
    writeFileSync(`./${value}`, buffer, { flag: 'w+' })
   })
}

