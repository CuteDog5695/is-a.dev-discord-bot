const Endpoint = 'https://mail.is-a.dev'

export default class MailcowApi {
    constructor (token) {
        this.token = token
    }
    
    async get (path) {
        const response = await fetch(`${Endpoint}${path}`, {
        headers: {
            'X-API-Key': this.token
        }
        })
        return response.json()
    }
    
    async post (path, data) {
        const response = await fetch(`${Endpoint}${path}`, {
        method: 'POST',
        headers: {
            'X-API-Key': this.token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
        }) 
        return response.json()
    }

    async delete (path) {
        const response = await fetch(`${Endpoint}${path}`, {
        method: 'DELETE',
        headers: {
            'X-API-Key': this.token
        }
        })
        return response.json()
    }
}

