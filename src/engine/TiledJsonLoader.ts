import Game from './Game';
import TileMap from './TileMap';
import LocalFileLoader from './LocalFileLoader';
import Image from './Image';

/**
 * Tiled 1.1.0 JSON Map Format
 * URL: http://docs.mapeditor.org/en/stable/reference/json-map-format/
 */
interface TiledJsonLayerChunk {
    data: number[] | string;    // Array of unsigned int (GIDs) or base64-encoded data
    height: number;             // Height in tiles
    width: number;              // Width in tiles
    x: number;                  // X coordinate in tiles
    y: number;                  // Y coordinate in tiles
}

interface TiledJsonLayerObjectPoint {
    x: number;
    y: number;
}

interface TiledJsonLayerObject {
    ellipse: boolean;                       // Used to mark an object as an ellipse
    gid: number;                            // GID, only if object comes from a Tilemap
    height: number;                         // Height in pixels. Ignored if using a gid.
    id: number;                             // Incremental id - unique across all objects
    name: string;                           // String assigned to name field in editor
    point: boolean;                         // Used to mark an object as a point
    polygon: TiledJsonLayerObjectPoint[];   // A list of x,y coordinates in pixels
    polyline: TiledJsonLayerObjectPoint[];  // A list of x,y coordinates in pixels
    properties: TiledJsonProperty[];        // A list of properties (name, value, type)
    rotation: number;                       // Angle in degrees clockwise
    template: string;                       // Reference to a template file, in case object is a template instance
    text: object;                           // String key-value pairs
    type: string;                           // String assigned to type field in editor
    visible: boolean;                       // Whether object is shown in editor.
    width: number;                          // Width in pixels. Ignored if using a gid.
    x: number;                              // X coordinate in pixels
    y: number;                              // Y coordinate in pixels
}

interface TiledJsonLayer {
    chunks: TiledJsonLayerChunk[];      // Array of chunks (optional). tilelayer only.
    compression: string;                // zlib, gzip or empty (default). tilelayer only.
    data: number[] | string;            // Array of unsigned int (GIDs) or base64-encoded data. tilelayer only.
    draworder: string;                  // topdown (default) or index. objectgroup only.
    encoding: string;                   // csv (default) or base64`. ``tilelayer only.
    height: number;                     // Row count. Same as map height for fixed-size maps.
    id: number;                         // Incremental id - unique across all layers
    image: string;                      // Image used by this layer. imagelayer only.
    layers: TiledJsonLayer[];           // Array of layers. group on
    name: string;                       // Name assigned to this layer
    objects: TiledJsonLayerObject[];    // Array of objects. objectgroup only.
    offsetx: number;                    // Horizontal layer offset in pixels (default: 0)
    offsety: number;                    // Vertical layer offset in pixels (default: 0)
    opacity: number;                    // Value between 0 and 1
    properties: TiledJsonProperty[];    // A list of properties (name, value, type).
    transparentcolor: string;           // Hex-formatted color (#RRGGBB) (optional, imagelayer only
    type: string;                       // tilelayer, objectgroup, imagelayer or group
    visible: boolean;                   // Whether layer is shown or hidden in editor
    width: number;                      // Column count. Same as map width for fixed-size maps.
    x: number;                          // Horizontal layer offset in tiles. Always 0.
    y: number;                          // Vertical layer offset in tiles. Always 0.
}

interface TiledJsonProperty {
    name: string;
    type: string;
    value: string;
}

interface TiledJsonTerrain {
    name: string;   // Name of terrain
    tile: number;   // Local ID of tile representing terrain
}

interface TiledJsonTileFrame {
    duration: number;   // Frame duration in milliseconds
    tileid: number;     // Local tile ID representing this frame
}

interface TiledJsonTile {
    animation: TiledJsonTileFrame[];    // Array of Frames
    id: number;                         // Local ID of the tile
    image: string;                      // Image representing this tile (optional)
    imageheight: number;                // Height of the tile image in pixels
    imagewidth: number;                 // Width of the tile image in pixels
    objectgroup: TiledJsonLayer;        // Layer with type objectgroup (optional)
    properties: TiledJsonProperty[];    // A list of properties (name, value, type)
    terrain: number[];                  // Index of terrain for each corner of tile
    type: string;                       // The type of the tile (optional)
}

interface TiledJsonTileSetGrid {
    orientation: string;    // Orientation of the grid for the tiles in this tileset (orthogonal or isometric)
    width: number;          // Width of a grid cell
    height: number;         // Height of a grid cell
}

interface TiledJsonTileSetOffset {
    x: number;  // Horizontal offset in pixels
    y: number;  // Vertical offset in pixels (positive is down)
}

interface WangColor {
    color: string;          // Hex-formatted color (#RRGGBB or #AARRGGBB)
    name: string;           // Name of the Wang color
    probability: number;    // Probability used when randomizing
    tile: number;           // Local ID of tile representing the Wang color
}

interface WangTile {
    dflip: boolean;     // Tile is flipped diagonally
    hflip: boolean;     // Tile is flipped horizontally
    tileid: number;     // Local ID of tile
    vflip: boolean;     // Tile is flipped vertically
    wangid: number[];   // Array of Wang color indexes (uchar[8])
}

interface WangSet {
    cornercolors: WangColor[];  // Array of Wang colors
    edgecolors: WangColor[];    // Array of Wang colors
    name: string;               // Name of the Wang set
    tile: number;               // Local ID of tile representing the Wang set
    wangtiles: WangTile[];      // Array of Wang tiles
}

interface TiledJsonTileSet {
    columns: number;                    // The number of tile columns in the tileset
    firstgid: number;                   // GID corresponding to the first tile in the set
    grid: TiledJsonTileSetGrid;         // See <grid> (optional)
    image: string;                      // Image used for tiles in this set
    imagewidth: number;                 // Width of source image in pixels
    imageheight: number;                // Height of source image in pixels
    margin: number;                     // Buffer between image edge and first tile (pixels)
    name: string;                       // Name given to this tileset
    properties: TiledJsonProperty[];    // A list of properties (name, value, type).
    spacing: number;                    // Spacing between adjacent tiles in image (pixels)
    terrains: TiledJsonTerrain[];       // Array of Terrains (optional)
    tilecount: number;                  // The number of tiles in this tileset
    tileheight: number;                 // Maximum height of tiles in this set
    tileoffset: TiledJsonTileSetOffset; // See <tileoffset> (optional)
    tiles: TiledJsonTile[];             // Array of Tiles (optional)
    tilewidth: number;                  // Maximum width of tiles in this set
    transparentcolor: string;           // Hex-formatted color (#RRGGBB) (optional)
    type: string;                       // tileset (for tileset files, since 1.0)
    wangsets: WangSet[];                // Array of Wang sets (since 1.1.5)
}

interface TiledJson {
    backgroundcolor: string;            // Hex-formatted color (#RRGGBB or #AARRGGBB) (optional)
    height: number;                     // Number of tile rows
    hexsidelength: number;              // Length of the side of a hex tile in pixels
    infinite: boolean;                  // Whether the map has infinite dimensions
    layers: TiledJsonLayer[];           // Array of Layers
    nextlayerid: number;                // Auto-increments for each layer
    nextobjectid: number;               // Auto-increments for each placed object
    orientation: string;                // orthogonal, isometric, staggered or hexagonal
    properties: TiledJsonProperty[];    // A list of properties (name, value, type).
    renderorder: string;                // Rendering direction (orthogonal maps only)
    staggeraxis: string;                // x or y (staggered / hexagonal maps only)
    staggerindex: string;               // odd or even (staggered / hexagonal maps only)
    tiledversion: string;               // The Tiled version used to save the file
    tileheight: number;                 // Map grid height
    tilesets: TiledJsonTileSet[];       // Array of Tilesets
    tilewidth: number;                  // Map grid width
    type: string;                       // map (since 1.0)
    version: number;                    // The JSON format version
    width: number;                      // Number of tile columns
}

export default class TiledJsonLoader {
    public static load(game: Game, filename: string, onload: (map: TileMap | null) => any): void {
        const loader = new LocalFileLoader();
        loader.loadAsText('./tilemap.json', (data: string | null): any => {
            if (data) {
                const mapdata: TiledJson = JSON.parse(data);
                console.log('MapSize:', mapdata.width, mapdata.height);
                console.log('TileSize:', mapdata.tilewidth, mapdata.tileheight);

                const map = new TileMap(mapdata.width, mapdata.height, mapdata.tilewidth, mapdata.tileheight);
                for (const tileset of mapdata.tilesets) {
                    map.addTileSet(new Image(game, tileset.image));
                    console.log('Tileset Added: ', tileset.image);
                }

                for (const layer of mapdata.layers) {
                    let layerData: number[][];
                    layerData = [];
                    for (let i = 0; i < layer.height; i++) {
                        layerData[i] = [];
                        for (let j = 0; j < layer.width; j++) {
                            layerData[i][j] = layer.data[i * layer.width + j] as number;
                        }
                    }

                    map.addLayer(layerData);
                }

                onload(map);
            } else {
                onload(null);
            }
        });
    }
}
