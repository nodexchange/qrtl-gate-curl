define(function () {
    var WallpaperSettings = {
        DEBUG: true,
        msnDivDebug: null,
        msnDebugShowSticky: true,
        msnDebugShowAlign: true,
        msnPlacement: 'default',
        msnVersion: 'fc-9a',

        msnPreviewMode: false,
        msnInitalized: false,

        msnScrollEnabled: false,
        msnScrollStuck: false,
        msnScrollCap: 140,
        msnScrollTop: 118,
        msnScrollWidthSupport: false,

        msnIsIE: false,
        msnIsEdge: false,
        msnHeadHeight: 250,
        msnHeadOffset: 0,
        msnPadOffset: 20,

        msnDivHolder: null,
        msnDivHeader: null,
        msnDivRailL: null,
        msnDivRailR: null,

        msnLogosArray: [],
        msnLogoCap: 'none',
        msnDivLogoHolder: null,
        msnDivLogoL: null,
        msnDivLogoC: null,
        msnDivLogoR: null,

        msnStepId: -1,
        msnWPWidth: 1264,
        msnWPHeight: 980,
        msnPreloadList: [0, 0, 0, 0, 0],
        msnPreloadCount: 0,
        msnSteps: [836, 942, 1152, 1264 /*, 1600*/ ],
        msnConWs: [642, 642, 928, 930 /* 1272 */ ]
    };

    var ADTECHEventsDefinitions = function () {
        //content -- height:754||815, logo_cap:auto
        ADTECH.getContent('wallpaper', '{main:".jpg",placement:"default||fcom",logo_cap:"none||836||942||1152||1264",alignment:"center||left",background:"#ffffff",custom_css:"",debug:false, fixed_rails:"true"}');
        ADTECH.getContent('steps', '{step_836:"1264x754_Skin_AOL.jpg",step_942:"1264x754_Skin_AOL.jpg",step_1152:"1264x754_Skin_AOL.jpg",step_1264:"1264x754_Skin_AOL.jpg",step_1600:"1264x754_Skin_AOL.jpg"}');
        // AD TECH.getConte nt('logos', '[{img:".png",pos:"left||right||center",width:0,height:0,offset_x:0,offset_y:0,fixed:false}]');

        //events
        ADTECH.event('wallpaper-click');
        ADTECH.event('header-click');
        ADTECH.event('rail-left-click');
        ADTECH.event('rail-right-click');
        ADTECH.event('rail-click');

        //clicks
        ADTECH.dynamicClick('Wallpaper');
    };

    return function () {
        return WallpaperSettings;
    };
});