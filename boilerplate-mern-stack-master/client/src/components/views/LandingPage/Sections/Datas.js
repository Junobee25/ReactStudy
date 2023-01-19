const continents = [
    {
        "_id":1,
        "name":"Africa"
    },
    {
        "_id":2,
        "name":"Europe"
    },
    {
        "_id":3,
        "name":"Asia"
    },
    {
        "_id":4,
        "name":"North America"
    },
    {
        "_id":5,
        "name":"South America"
    },
    {
        "_id":6,
        "name":"Australia"
    },
    {
        "_id":7,
        "name":"Antarctica"
    }

]


const price = [
    {

        "_id":0,
        "name":"Any",
        "array": [],
    },
    {
        "_id":1,
        "name":"0 to 100",
        "array":[0,100]
    },
    {

        "_id":2,
        "name":"1000 to 1200",
        "array": [1000,1200],
    },
    {
        "_id":3,
        "name":"1201 to 1500",
        "array":[1201,1500]
    },
    {
        "_id":4,
        "name":"1501 to 2000",
        "array": [1501,2000],
    },
    {
        "_id":5,
        "name":"More than 2000",
        "array":[2001,1000000]
    }
]


export {
    continents,
    price
}