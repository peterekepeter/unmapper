/* eslint-disable semi */
import { EditorSelection } from "./model/EditorSelection"
import { create_initial_editor_state, EditorOptions, EditorState, ViewportState } from "./model/EditorState"
import { load_map_from_string, store_map_to_string } from "./model/loader"
import { Rotation } from "./model/Rotation"
import { Vector } from "./model/Vector"

const LEVEL_KEY = 'Initial Editor State'
const EXTRA_KEY = 'Editor Extra State'
const STORAGE: Storage = setup_storage()

type ExtraStoredState = {
   viewports: ViewportState[];
   options: EditorOptions;
   selection: EditorSelection;
}

export function get_initial_level_state(): EditorState {
   const map_string = STORAGE.getItem(LEVEL_KEY) || DEFAULT_INITIAL_LEVEL
   const state = {
      ...create_initial_editor_state(),
      map: load_map_from_string(map_string)
   }
   const extra_json = STORAGE.getItem(EXTRA_KEY)
   if (extra_json){
      const extra = JSON.parse(extra_json) as Partial<ExtraStoredState>

      // copy options
      state.options = { ...state.options, ...extra.options }

      // parse viewports
      for (let i=0; i<state.viewports.length; i++){
         const dest = state.viewports[i]
         const parsed = extra.viewports[i]
         dest.mode = parsed.mode
         dest.center_location = new Vector(parsed.center_location.x, parsed.center_location.y, parsed.center_location.z)
         dest.zoom_level = parsed.zoom_level
         dest.rotation = new Rotation(parsed.rotation.pitch, parsed.rotation.yaw, parsed.rotation.roll)
      }

      // selection
      state.selection = extra.selection
   }
   return state
}

export function reset_initial_level_state(): void {
   STORAGE.removeItem(LEVEL_KEY)
   STORAGE.removeItem(EXTRA_KEY)
}

export function set_initial_level_state(state: EditorState): void {
   const map_string = store_map_to_string(state.map)
   STORAGE.setItem(LEVEL_KEY, map_string)
   const extra : ExtraStoredState = {
      options: state.options,
      viewports: state.viewports,
      selection: state.selection
   } 
   STORAGE.setItem(EXTRA_KEY, JSON.stringify(extra))
}

function setup_storage(): Storage {
   if (typeof window !== 'undefined'){
      return window.sessionStorage
   } else {
      return {
         setItem: (): void => null, 
         getItem: (): string => null, 
         removeItem: (): void => null 
      } as unknown as Storage
   }
}


const DEFAULT_INITIAL_LEVEL = `Begin Map
Begin Actor Class=Brush Name=Brush491
    CsgOper=CSG_Add
    Begin Brush Name=Model497
       Begin PolyList
          Begin Polygon Item=OUTSIDE Flags=32
             Origin   -00256.000000,-00256.000000,+00256.000000
             Normal   +00000.000000,+00000.000000,+00001.000000
             TextureU +00000.000000,+00001.000000,+00000.000000
             TextureV -00001.000000,+00000.000000,+00000.000000
             Vertex   -00256.000000,-00256.000000,+00256.000000
             Vertex   +00256.000000,-00256.000000,+00256.000000
             Vertex   +00256.000000,+00256.000000,+00256.000000
             Vertex   -00256.000000,+00256.000000,+00256.000000
          End Polygon
          Begin Polygon Item=OUTSIDE Link=1
             Origin   -00256.000000,+00256.000000,-00256.000000
             Normal   +00000.000000,+00000.000000,-00001.000000
             TextureU +00000.000000,-00001.000000,+00000.000000
             TextureV -00001.000000,+00000.000000,+00000.000000
             Vertex   -00256.000000,+00256.000000,-00256.000000
             Vertex   +00256.000000,+00256.000000,-00256.000000
             Vertex   +00256.000000,-00256.000000,-00256.000000
             Vertex   -00256.000000,-00256.000000,-00256.000000
          End Polygon
          Begin Polygon Item=OUTSIDE Flags=32 Link=2
             Origin   -00256.000000,+00256.000000,-00256.000000
             Normal   +00000.000000,+00001.000000,+00000.000000
             TextureU -00001.000000,+00000.000000,+00000.000000
             TextureV +00000.000000,+00000.000000,-00001.000000
             Vertex   -00256.000000,+00256.000000,-00256.000000
             Vertex   -00256.000000,+00256.000000,+00256.000000
             Vertex   +00256.000000,+00256.000000,+00256.000000
             Vertex   +00256.000000,+00256.000000,-00256.000000
          End Polygon
          Begin Polygon Item=OUTSIDE Flags=32 Link=3
             Origin   +00256.000000,-00256.000000,-00256.000000
             Normal   +00000.000000,-00001.000000,+00000.000000
             TextureU +00001.000000,+00000.000000,+00000.000000
             TextureV +00000.000000,+00000.000000,-00001.000000
             Vertex   +00256.000000,-00256.000000,-00256.000000
             Vertex   +00256.000000,-00256.000000,+00256.000000
             Vertex   -00256.000000,-00256.000000,+00256.000000
             Vertex   -00256.000000,-00256.000000,-00256.000000
          End Polygon
          Begin Polygon Item=OUTSIDE Flags=32 Link=4
             Origin   +00256.000000,+00256.000000,-00256.000000
             Normal   +00001.000000,+00000.000000,+00000.000000
             TextureU +00000.000000,+00001.000000,+00000.000000
             TextureV +00000.000000,+00000.000000,-00001.000000
             Vertex   +00256.000000,+00256.000000,-00256.000000
             Vertex   +00256.000000,+00256.000000,+00256.000000
             Vertex   +00256.000000,-00256.000000,+00256.000000
             Vertex   +00256.000000,-00256.000000,-00256.000000
          End Polygon
          Begin Polygon Item=OUTSIDE Flags=32 Link=5
             Origin   -00256.000000,-00256.000000,-00256.000000
             Normal   -00001.000000,+00000.000000,+00000.000000
             TextureU +00000.000000,-00001.000000,+00000.000000
             TextureV +00000.000000,+00000.000000,-00001.000000
             Vertex   -00256.000000,-00256.000000,-00256.000000
             Vertex   -00256.000000,-00256.000000,+00256.000000
             Vertex   -00256.000000,+00256.000000,+00256.000000
             Vertex   -00256.000000,+00256.000000,-00256.000000
          End Polygon
       End PolyList
    End Brush
    Tag=Brush
    Brush=Model'MyLevel.Model497'
End Actor
End Map
`