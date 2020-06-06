import { importActor } from "../import-actor";
import { Actor } from "../../../Actor";
import { Vector } from "../../../Vector";
import { CsgOperation } from "../../../CsgOperation";


test('can import empty actor', () => {
    expect(importActor("Begin Actor End Actor")).not.toBeNull();
});

test('can import actor with class and name', () => {
    const actor = importActor(`
        Begin Actor Class=Brush Name=Brush555 
        End Actor
    `);
    expect(actor.className).toBe("Brush");
    expect(actor.name).toBe("Brush555");
});

test('can import actor with location and old location', () => {
    const actor = importActor(`
        Begin Actor Class=Brush Name=Brush555 
            Location=(X=1280.000000,Y=-1408.000000,Z=-144.000000)
            OldLocation=(X=1296.000000,Y=-1392.000000,Z=-144.000000)
        End Actor
    `);
    expect(actor.location).toEqual(new Vector(1280,-1408,-144));
    expect(actor.oldLocation).toEqual(new Vector(1296,-1392,-144));
});

test('can import actor single group', () => {
    const actor = importActor(`
        Begin Actor Class=Brush Name=Brush555 
            Group=None
        End Actor
    `);
    expect(actor.group).toEqual(["None"]);
});

test('can import actor multiple group', () => {
    const actor = importActor(`
        Begin Actor Class=Brush Name=Brush555 
            Group=None,Test Group 1,Cube
        End Actor
    `);
    expect(actor.group).toEqual(["None", "Test Group 1", "Cube"]);
});

test('can import brush csg operation', () => {
    const actor = importActor(`
        Begin Actor Class=Brush Name=Brush10
            CsgOper=CSG_Subtract
        End Actor
    `);
    expect(actor.csgOperation).toBe(CsgOperation.Subtract);
})

test('can import brush actor', () => {
    const actor = importActor(`
        Begin Actor Class=Brush Name=Brush559
            CsgOper=CSG_Add
            MainScale=(SheerAxis=SHEER_ZX)
            PostScale=(SheerAxis=SHEER_ZX)
            Level=LevelInfo'MyLevel.LevelInfo0'
            Tag=Brush
            Region=(Zone=ZoneInfo'MyLevel.ZoneInfo15',iLeaf=1316,ZoneNumber=1)
            Location=(X=-608.000000,Y=-1696.000000,Z=-176.000000)
            bSelected=True
            Begin Brush Name=Model557
            Begin PolyList
                Begin Polygon Item=Sheet Flags=264
                    Origin   +00128.000000,+00128.000000,+00000.000000
                    Normal   +00000.000000,+00000.000000,-00001.000000
                    TextureU -00001.000000,+00000.000000,+00000.000000
                    TextureV +00000.000000,+00001.000000,+00000.000000
                    Vertex   +00128.000000,+00128.000000,+00000.000000
                    Vertex   +00128.000000,-00128.000000,+00000.000000
                    Vertex   -00128.000000,-00128.000000,+00000.000000
                    Vertex   -00128.000000,+00128.000000,+00000.000000
                End Polygon
            End PolyList
            End Brush
            Brush=Model'MyLevel.Model557'
            Name=Brush559
        End Actor
    `)
    expect(actor.className).toBe('Brush');
    expect(actor.unsupportedProperties.bSelected).toBe("True");
    expect(actor.brushModel).not.toBeNull();
    expect(actor.brushModel.polygons).toHaveLength(1);
})