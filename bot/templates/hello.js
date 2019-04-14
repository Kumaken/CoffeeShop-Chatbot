const ctx = require('../../context')

module.exports = async (user) => {
  try {
    let replies = [];
    replies.push({
      type: 'text',
      text: 'Halo! Selamat datang di kedai Coffee!'
    })

    replies.push({
        "type": "image",
        "originalContentUrl": "https://www.sciencenews.org/sites/default/files/main/articles/100315_coffee_opener_NEW_0.jpg",
        "previewImageUrl": "https://www.sciencenews.org/sites/default/files/main/articles/100315_coffee_opener_NEW_0.jpg",
        "animated": false
    })

    replies.push({
      "type": "template",
      "altText": "this is a buttons template",
      "template": {
        "type": "buttons",
        "actions": [
          {
            "type": "message",
            "label": "Katalog Produk",
            "text": "Apa saja produk yang dijual?"
          },
          {
            "type": "postback",
            "label": "Tentang Kami",
            "data": "about"
          }
        ],
        "title": "Menu",
        "text": "Ada yang bisa kami bantu?"
      }
    })
    return replies
  }
  catch(e) {
    throw new Error(e)
  }    
}