

export const fetchRequest = async (url: string, method: string, body: object|null) => {
  try {
    const res = await fetch(url, {
      method: method,
      ...method !== 'get' && {headers: {
        'Content-Type': 'application/json'
      }},
      ...method !== 'get' && {body: JSON.stringify(body)}
    });
    const data = await res.json()
    return [data, null]
  } catch(err) {
    console.log(err)
    return [null, err]
  }

}