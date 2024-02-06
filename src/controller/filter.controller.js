const axios = require('axios');

const USERS_API = 'https://jsonplaceholder.typicode.com/users';
const ALBUMS_API = 'https://jsonplaceholder.typicode.com/albums';
const PHOTOS_API = 'https://jsonplaceholder.typicode.com/photos';

let getFilter = async (req, res) => {

    const { title, albumTitle, userEmail } = req.query;

    try 
    {
        const photosResponse = await axios.get(`${PHOTOS_API}`);
        let allPhotos = photosResponse.data;

        const albumResponse = await axios.get(`${ALBUMS_API}`);
        const albumData = albumResponse.data;

        const userResponse = await axios.get(`${USERS_API}`);
        const userData = userResponse.data;

        let filterElement = [];

        allPhotos.forEach(element => { 

            const albumSearch = albumData.filter((album) => album.id == element.albumId);
            const userSearch = userData.filter((user) => user.id == albumSearch[0].userId);

            const informationPhoto = {
                id: element.id,
                title: element.title,
                url: element.url,
                thumbnailUrl: element.thumbnailUrl,
                album: {
                    id: albumSearch[0].id,
                    title: albumSearch[0].title,
                    user: userSearch[0]
                }
            };

            filterElement.push(informationPhoto)
        });

        if(title != "")
        {
            filterElement = filterElement.filter((photo) => photo.title.includes(title));
        }

        if(albumTitle != "")
        {
            filterElement = filterElement.filter((photo) => photo.album.title.includes(albumTitle));
        }

        if(userEmail != "")
        {
            filterElement = filterElement.filter((photo) => photo.album.user.email === userEmail);
        }

        const limit = parseInt(req.query.limit) || 25;
        const offset = parseInt(req.query.offset) || 0;
        const paginatedPhotos = filterElement.slice(offset, offset + limit);

        return res.status(200).json(paginatedPhotos);
        
    } 
    catch (error) 
    {
        res.status(500).json({ error: error });
    }
}

let getPhotos = async (req, res) => {

    const { photoId } = req.params;

    try 
    {
        const photoResponse = await axios.get(`${PHOTOS_API}/${photoId}`);
        const photoData = photoResponse.data;

        if(photoData == null){
            return res.status(500).json({ error: 'No existe la foto solicitada' });
        }

        const albumResponse = await axios.get(`${ALBUMS_API}/${photoData.albumId}`);
        const albumData = albumResponse.data;

        const userResponse = await axios.get(`${USERS_API}/${albumData.userId}`);
        const userData = userResponse.data;

        const enrichedData = {
            id: photoData.id,
            title: photoData.title,
            url: photoData.url,
            thumbnailUrl: photoData.thumbnailUrl,
            album: {
                id: albumData.id,
                title: albumData.title,
                user: userData,
            }
        };

        return res.status(200).json(enrichedData);

    } 
    catch (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}  

  

module.exports = {
    getFilter,
    getPhotos
}