
import { loadMapFromString, storeMapToString } from '../';

check('empty map', 
`Begin Map
End Map
`);

check('minimal actor', 
`Begin Map
Begin Actor Class=ZoneInfo Name=ZoneInfo123
End Actor
End Map
`);

check('minimal actor, with space in name', 
`Begin Map
Begin Actor Class=ZoneInfo Name="Zone Info123"
End Actor
End Map
`);

check('minimal actor, class only', 
`Begin Map
Begin Actor Class=ZoneInfo
End Actor
End Map
`);

check('map just a light', 
`Begin Map
Begin Actor Class=Light Name=Light0
    bDynamicLight=True
    Level=LevelInfo'MyLevel.LevelInfo0'
    Tag=Light
    Region=(Zone=LevelInfo'MyLevel.LevelInfo0',iLeaf=-1)
    Location=(X=96.000000,Y=-96.000000,Z=16.000000)
    OldLocation=(X=96.000000,Y=-96.000000,Z=16.000000)
End Actor
End Map
`);

function check(testName : string, testData : string){
    test(testName, () => {
        expect(storeMapToString(loadMapFromString(testData))).toBe(testData);
    });
}