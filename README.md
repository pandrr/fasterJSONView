# fasterJSONView
displays json files in a readable format

- big arrays are summarized: only type of content and number of items are shown 
- it can handle huge json files, e.g. 10mb or greater
- syntax highlighting is not 100% perfect, but fast

example output:
```
meshes: 
[
    {
        name: "defaultobject",
        transformation: [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
        meshes: [0]
        materialindex: 0,
        primitivetypes: 4,
        vertices: [array of 27105 numbers],
        normals: [array of 27105 numbers],
        tangents: [array of 27105 numbers],
        bitangents: [array of 27105 numbers],
        numuvcomponents: [2]
        texturecoords: 
        [
            [array of 18070 numbers]
        ],
        faces: 
        [
            [14600 objects NOT SHOWN]
        ]
    }
]
```
