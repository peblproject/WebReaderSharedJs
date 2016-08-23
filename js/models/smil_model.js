//  LauncherOSX
//
//  Created by Boris Schneiderman.
// Modified by Daniel Weck
//  Copyright (c) 2014 Readium Foundation and/or its licensees. All rights reserved.
//  
//  Redistribution and use in source and binary forms, with or without modification, 
//  are permitted provided that the following conditions are met:
//  1. Redistributions of source code must retain the above copyright notice, this 
//  list of conditions and the following disclaimer.
//  2. Redistributions in binary form must reproduce the above copyright notice, 
//  this list of conditions and the following disclaimer in the documentation and/or 
//  other materials provided with the distribution.
//  3. Neither the name of the organization nor the names of its contributors may be 
//  used to endorse or promote products derived from this software without specific 
//  prior written permission.
//  
//  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
//  ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
//  WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
//  IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
//  INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
//  BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
//  DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF 
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE 
//  OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
//  OF THE POSSIBILITY OF SUCH DAMAGE.
define (["../helpers"], function(Helpers) {

var Smil = {};

/**
 * Returns the parent of the SMIL file by checking out the nodes
 *
 * @class      SmilNode
 * @param      {String} parent
 * @return     {Container} node 
 */

Smil.SmilNode = function(parent) {

    this.parent = parent;
    
    this.id = "";
    
    //root node is a smil model
    this.getSmil = function() {

        var node = this;
        while(node.parent) {
            node = node.parent;
        }

        return node;
    };
    /**
     * Checks out if the current file has a parent folder
     *
     * @method     hasAncestor
     * @param      {Container} node
     * @return     {Bool} true or false 
     */
    this.hasAncestor = function(node)
    {
        var parent = this.parent;
        while(parent)
        {
            if (parent == node)
            {
                return true;
            }

            parent = parent.parent;
        }

        return false;
    };
};

/**
 * ... 
 *
 * @class      Models.TimeContainerNode
 * @constructor
 * @param      {String} parent
 * @return     {Bool} true or false 
 */

Smil.TimeContainerNode = function(parent) {

    /**
     * The parent folder
     *
     * @property parent
     * @type string
     */
    
    this.parent = parent;
    
    /**
     * The children folder
     *
     * @property children
     * @type Undefined
     */

    this.children = undefined;
    
    /**
     * The index
     *
     * @property index
     * @type Undefined
     */

    this.index = undefined;
    
    /**
     * The epub type
     *
     * @property epubtype
     * @type string
     */

    this.epubtype = "";


    /**
     * Checks if the SMIL is scapable.
     *
     * @method     isEscapable
     * @param      {Array} userEscapables
     * @return     {Bool} true or false 
     */

    this.isEscapable = function(userEscapables)
    {
        if (this.epubtype === "")
        {
            return false;
        }

        var smilModel = this.getSmil();
        if (!smilModel.mo)
        {
            return false;
        }

        var arr = smilModel.mo.escapables;
        if (userEscapables.length > 0)
        {
            arr = userEscapables;
        }

        for (var i = 0; i < arr.length; i++)
        {
            if (this.epubtype.indexOf(arr[i]) >= 0)
            {
                return true;
            }
        }

        return false;
    };

    /**
     * Checks ???
     *
     * @method     userSkippables
     * @param      {Array} userSkippables
     * @return     {Bool} true or false 
     */

    this.isSkippable = function(userSkippables)
    {
        if (this.epubtype === "")
        {
            return false;
        }
        
        var smilModel = this.getSmil();
        if (!smilModel.mo)
        {
            return false;
        }

        var arr = smilModel.mo.skippables;
        if (userSkippables.length > 0)
        {
            arr = userSkippables;
        }

        for (var i = 0; i < arr.length; i++)
        {
            if (this.epubtype.indexOf(arr[i]) >= 0)
            {
                return true;
            }
        }

        return false;
    };
};

Smil.TimeContainerNode.prototype = new Smil.SmilNode();


/**
 * Looks for the media parent folder
 *
 * @Class      Model.MediaNode
 * @Constructor
 * @param      {string} parent
 */

Smil.MediaNode = function(parent) {

    /**
     * The parent folder
     *
     * @property parent
     * @type string
     */

    this.parent = parent;
    
    /**
     * The source file name
     *
     * @property src
     * @type string
     */

    this.src = "";
};

Smil.MediaNode.prototype = new Smil.SmilNode();

////////////////////////////
//SeqNode

/**
 * Node Sequence
 *
 * @class      Models.SeqNode
 * @constructor
 * @param      {string} parent
 * @return     Undefined
 */

Smil.SeqNode = function(parent) {

    /**
     * The parent folder
     *
     * @property parent
     * @type string
     */

    this.parent = parent;

    /**
     * The children folder
     *
     * @property children
     * @type Undefined
     */

    this.children = [];

    /**
     * The node type which is a sequence here
     *
     * @property nodeType
     * @type Array
     */

    this.nodeType = "seq";

    /**
     * The text reference which is empty at the moment
     *
     * @property textref
     * @type string
     */

    this.textref = "";
    
    /**
     * Looks for the media parent folder
     *
     * @method     durationMilliseconds
     * @return     {Number} total
     */

    this.durationMilliseconds = function()
    {

       /**
        * Assign the current Smil to the var called smilData
        *
        * @property smilData
        * @type Object
        */

        var smilData = this.getSmil();
        
       /**
        * A duration set to 0
        *
        * @property total
        * @type Number
        */

        var total = 0;
        
        for (var i = 0; i < this.children.length; i++)
        {
            var container = this.children[i];
            if (container.nodeType === "par")
            {
                if (!container.audio)
                {
                    continue;
                }
                if (container.text && (!container.text.manifestItemId || container.text.manifestItemId != smilData.spineItemId))
                {
// console.log(container.text);
// console.log(smilData.spineItemId);
                    continue;
                }
                
                var clipDur = container.audio.clipDurationMilliseconds();
                total += clipDur;
            }
            else if (container.nodeType === "seq")
            {
                total += container.durationMilliseconds();
            }
        }
        console.log("Durée totale du SMIL:" + total);
        return total;
    };
    
   /**
     * Checks if there's a clip offset.
     *
     * @method     clipOffset
     * @param      {Number} offset
     * @param      {Container} par
     * @return     {Bool} True is when the container is "parallel".
     */ 

    this.clipOffset = function(offset, par)
    {

       /**
        * Assign the current Smil to the var called smilData
        *
        * @property smilData
        * @type Object
        */

        var smilData = this.getSmil();
        
        for (var i = 0; i < this.children.length; i++)
        {
            var container = this.children[i];
            if (container.nodeType === "par")
            {
                if (container == par)
                {
                    return true;
                }

                if (!container.audio)
                {
                    continue;
                }

                if (container.text && (!container.text.manifestItemId || container.text.manifestItemId != smilData.spineItemId))
                {
                    continue;
                }

                var clipDur = container.audio.clipDurationMilliseconds();
                offset.offset += clipDur;
            }
            else if (container.nodeType === "seq")
            {
                var found = container.clipOffset(offset, par);
                if (found)
                {
                    return true;
                }
            }
        }

        return false;
    };


   /**
     * Checks ???
     *
     * @method     parallelAt
     * @param      {Number} timeMilliseconds
     * @return     {Container OR para OR undefined}
     */ 

    this.parallelAt = function(timeMilliseconds)
    {
        
       /**
        * Assign the current Smil to the var called smilData
        *
        * @property smilData
        * @type Object
        */

        var smilData = this.getSmil();
        
       /**
        * Sets the offset duration to 0
        *
        * @property offset
        * @type Number
        * @return undefinded
        */

        var offset = 0;

        for (var i = 0; i < this.children.length; i++)
        {
            var timeAdjusted = timeMilliseconds - offset;

            var container = this.children[i];
            
            if (container.nodeType === "par")
            {
                if (!container.audio)
                {
                    continue;
                }

                if (container.text && (!container.text.manifestItemId || container.text.manifestItemId != smilData.spineItemId))
                {
                    continue;
                }

                var clipDur = container.audio.clipDurationMilliseconds();

                if (clipDur > 0 && timeAdjusted <= clipDur)
                {
                    return container;
                }

                offset += clipDur;
            }
            else if (container.nodeType === "seq")
            {
                var para = container.parallelAt(timeAdjusted);
                if (para)
                {
                    return para;
                }

                offset += container.durationMilliseconds();
            }
        }

        return undefined;
    };

    /**
     * Checks ???
     *
     * @method     nthParallel
     * @param      {???} index
     * @param      {Number} count
     * @return     {container OR para OR undefined} ???
     */    

    this.nthParallel = function(index, count)
    {
        for (var i = 0; i < this.children.length; i++)
        {
            var container = this.children[i];
            
            if (container.nodeType === "par")
            {
                count.count++;

                if (count.count == index)
                {
                    return container;
                }
            }
            else if (container.nodeType === "seq")
            {
                var para = container.nthParallel(index, count);
                if (para)
                {
                    return para;
                }
            }
        }

        return undefined;
    };
    
};

Smil.SeqNode.prototype = new Smil.TimeContainerNode();

//////////////////////////
//ParNode

/**
 * Returns the parent of the SMIL file by checking out the nodes
 *
 * @class      ParNode
 * @param      {String} parent
 * @return     undefined OR {String} parent
 */

Smil.ParNode = function(parent) {

    /**
     * The parent folder
     *
     * @property parent
     * @type string
     */

    this.parent = parent;
    
    /**
     * The children files
     *
     * @property children
     * @type array
     */

    this.children = [];
    
    /**
     * The Node Type
     *
     * @property nodeType which is equal to "par" here
     * @type string
     */

    this.nodeType = "par";

    /**
     * Some text
     *
     * @property text which is undefined
     * @type text
     */
    this.text = undefined;
    
    /**
     * Some audio
     *
     * @property audio which is undefined 
     * @type media
     */
    
    this.audio = undefined;

    /**
     * An element of the epub archive
     *
     * @property element which is undefined
     * @type unknown
     */
    
    this.element = undefined;    

    /**
     * Getter of the first sequence ancestor by using the epub type
     *
     * @method     getFirstSeqAncestorWithEpubType
     * @param      {string} epubtype
     * @param      {Number} includeSelf
     * @return     {undefined} undefined
     */       

    this.getFirstSeqAncestorWithEpubType = function(epubtype, includeSelf) {
        if (!epubtype) return undefined;
        
        var parent = includeSelf ? this : this.parent;
        while (parent)
        {
            if (parent.epubtype && parent.epubtype.indexOf(epubtype) >= 0)
            {
                return parent; // assert(parent.nodeType === "seq")
            }
            
            parent = parent.parent;
        }
        
        return undefined;
    };
};

Smil.ParNode.prototype = new Smil.TimeContainerNode();

//////////////////////////
//TextNode

/**
 * Node Sequence
 *
 * @class      Models.SeqNode
 * @constructor
 * @param      {string} parent
 * @return     Undefined
 */

Smil.TextNode = function(parent) {

    /**
     * The parent folder
     *
     * @property parent
     * @type string
     */

    this.parent = parent;

    /**
     * The node type
     *
     * @property nodeType
     * @type string which is "text"
     */

    this.nodeType = "text";

    /**
     * The source file
     *
     * @property srcFile
     * @type string which is empty for the moment
     */
    
    this.srcFile = "";
    
    /**
     * A fragment of the source file ID
     *
     * @property srcFragmentId
     * @type string which is empty for the moment
     */

    this.srcFragmentId = "";
    
    /**
     * The ID of the manifest for the current item
     *
     * @property manifestItemId
     * @type string
     */
    
    this.manifestItemId = undefined;
    
    /**
     * Updates the ID of the manifest for the current media
     *
     * @method     updateMediaManifestItemId 
     * @return     {undefined} undefined
     */  

    this.updateMediaManifestItemId = function()
    {

       /**
        * Assign the current Smil to the var called smilData
        *
        * @property smilData
        * @type Object
        */

        var smilData = this.getSmil();
        
        if (!smilData.href || !smilData.href.length)
        {
            return; // Blank MO page placeholder, no real SMIL
        }
        
        // var srcParts = item.src.split('#');
//         item.srcFile = srcParts[0];
//         item.srcFragmentId = (srcParts.length === 2) ? srcParts[1] : "";
        
        var src = this.srcFile ? this.srcFile : this.src;
// console.log("src: " + src);
// console.log("smilData.href: " + smilData.href);
        var ref = Helpers.ResolveContentRef(src, smilData.href);
//console.log("ref: " + ref);
        var full = smilData.mo.package.resolveRelativeUrlMO(ref);
// console.log("full: " + full);
// console.log("---");
        for (var j = 0; j < smilData.mo.package.spine.items.length; j++)
        {
            var item = smilData.mo.package.spine.items[j];
//console.log("item.href: " + item.href);
            var url = smilData.mo.package.resolveRelativeUrl(item.href);
//console.log("url: " + url);
            if (url === full)
            {
//console.error("FOUND: " + item.idref);
                this.manifestItemId = item.idref;
                return;
            }
        }
        
        console.error("Cannot set the Media ManifestItemId? " + this.src + " && " + smilData.href);
        
//        throw "BREAK";
    };
    
};

Smil.TextNode.prototype = new Smil.MediaNode();

///////////////////////////
//AudioNode

/**
 * Looks for the media parent folder
 *
 * @Class      Model.AudioNode
 * @Constructor
 * @param      {string} parent
 */

Smil.AudioNode = function(parent) {

    /**
     * This var contains "parent"
     *
     * @property parent
     * @type string
     */

    this.parent = parent;

    /**
     * The node type
     *
     * @property nodeType which is set to "audio"
     * @type string
     */

    this.nodeType = "audio";

    /**
     * Setting the beginning of the audio clip to 0
     *
     * @property clipBegin which is set to 0
     * @type number
     */

    this.clipBegin = 0;

    /**
     * The max duration of the audio clip which is almost infinite
     *
     * @property MAX 
     * @type number which is 1234567890.1
     */

    this.MAX = 1234567890.1; //Number.MAX_VALUE - 0.1; //Infinity;
    
    /**
     * Setting the end of the audio clip to the maximum value
     *
     * @property clipEnd
     * @type number
     */

    this.clipEnd = this.MAX;
    
    /**
     * The duration of the audio file
     *
     * @method     clipDurationMilliseconds
     * @return     {number} _clipEndMilliseconds - clipBeginMilliseconds (which is the total duration)
     */  

    this.clipDurationMilliseconds = function()
    {
        var _clipBeginMilliseconds = this.clipBegin * 1000;
        var _clipEndMilliseconds = this.clipEnd * 1000;
        
        if (this.clipEnd >= this.MAX || _clipEndMilliseconds <= _clipBeginMilliseconds)
        {
            return 0;
        }

        return _clipEndMilliseconds - _clipBeginMilliseconds;
    };  
};

Smil.AudioNode.prototype = new Smil.MediaNode();

//////////////////////////////
//SmilModel

/**
 * Seeks informations about the Smil Model
 *
 * @Class      Model.SmilModel
 * @Constructor
 */

var SmilModel = function() {

    /**
     * The parent folder
     *
     * @property parent
     * @type string
     */

    this.parent = undefined;
    
    /**
     * Collection of seq or par smil nodes
     *
     * @property children
     * @type string
     */
    
    this.children = []; //collection of seq or par smil nodes
    
    /**
     * The manifest item ID set to undefined
     *
     * @property id
     * @type number
     */

    this.id = undefined; //manifest item id

    /**
     * The href of the .smil source file
     *
     * @property href
     * @type number
     */

    this.href = undefined; //href of the .smil source file
    
    /**
     * The duration of the .smil source file set to undefined
     *
     * @property duration
     * @type undefined
     */

    this.duration = undefined;

    /**
     * ??? (supposed to be the size of the file)
     *
     * @property mo
     * @type number
     */

    this.mo = undefined;

    /**
     * checks if the smil file is parallel
     *
     * @method     parallelAt
     * @param      {Number} timeMillisecond 
     * @Return     {???} this.children[0].parallelAt(timeMilliseconds) The moment where the smil file is parallel
     */
    
    this.parallelAt = function(timeMilliseconds)
    {
        return this.children[0].parallelAt(timeMilliseconds);
    };

    /**
     * ???
     *
     * @method     nthParallel
     * @param      {???} index
     * @Return     {???} this.children[0].nthParallel(index, count)
     */

    this.nthParallel = function(index)
    {
        var count = {count: -1};
        return this.children[0].nthParallel(index, count);
    };

    /**
     * Looks for the offset of the audio clip
     *
     * @method     clipOffset
     * @param      {???} par
     * @Return     {number} offset
     */

    this.clipOffset = function(par)
    {
        var offset = {offset: 0};
        if (this.children[0].clipOffset(offset, par))
        {
            return offset.offset;
        }

        return 0;
    };

    /**
     * Estimates the duration of the Smil file
     *
     * @method     durationMilliseconds_Calculated
     * @param      
     * @Return     {number?} this.children[0].durationMilliseconds()
     */

    
    this.durationMilliseconds_Calculated = function()
    {
        return this.children[0].durationMilliseconds();
    };
    

    var _epubtypeSyncs = [];
    // 
    // this.clearSyncs = function()
    // {
    //     _epubtypeSyncs = [];
    // };

    this.hasSync = function(epubtype)
    {
        for (var i = 0; i < _epubtypeSyncs.length; i++)
        {
            if (_epubtypeSyncs[i] === epubtype)
            {
//console.debug("hasSync OK: ["+epubtype+"]");
                return true;
            }
        }
        
//console.debug("hasSync??: ["+epubtype+"] " + _epubtypeSyncs);
        return false;
    };
    
    this.addSync = function(epubtypes)
    {
        if (!epubtypes) return;
        
//console.debug("addSyncs: "+epubtypes);

        var parts = epubtypes.split(' ');
        for (var i = 0; i < parts.length; i++)
        {
            var epubtype = parts[i].trim();

            if (epubtype.length > 0 && !this.hasSync(epubtype))
            {
                _epubtypeSyncs.push(epubtype);

//console.debug("addSync: "+epubtype);
            }
        }
    };
    
};

/**
 * Looks for the media parent folder
 *
 * @Class      Model.fromSmilDTO
 * @Constructor
 * @param      {string} parent
 */

SmilModel.fromSmilDTO = function(smilDTO, mo) {

    if (mo.DEBUG)
    {
        console.debug("Media Overlay DTO import...");
    }

    var indent = 0;
    var getIndent = function()
    {
        var str = "";
        for (var i = 0; i < indent; i++)
        {
            str += "   ";
        }
        return str;
    }

    var smilModel = new SmilModel();
    smilModel.id = smilDTO.id;
    smilModel.spineItemId = smilDTO.spineItemId;
    smilModel.href = smilDTO.href;
    
    smilModel.smilVersion = smilDTO.smilVersion;
    
    smilModel.duration = smilDTO.duration;
    if (smilModel.duration && smilModel.duration.length && smilModel.duration.length > 0)
    {
        console.error("SMIL duration is string, parsing float... (" + smilModel.duration + ")");
        smilModel.duration = parseFloat(smilModel.duration);
    }
    
    smilModel.mo = mo; //Models.MediaOverlay

    if (smilModel.mo.DEBUG)
    {
        console.log("JS MO smilVersion=" + smilModel.smilVersion);
        console.log("JS MO id=" + smilModel.id);
        console.log("JS MO spineItemId=" + smilModel.spineItemId);
        console.log("JS MO href=" + smilModel.href);
        console.log("JS MO duration=" + smilModel.duration);
    }

    /**
     * Var containing the copied property
     *
     * @method     durationMilliseconds_Calculated
     * @param      {???} property
     * @param      {string} from the original location
     * @param      {string} to the destination folder
     */

    var safeCopyProperty = function(property, from, to, isRequired) {

        if((property in from))
        { // && from[property] !== ""

            if( !(property in to) ) {
                console.debug("property " + property + " not declared in smil node " + to.nodeType);
            }

            to[property] = from[property];

            if (smilModel.mo.DEBUG)
            {
            console.log(getIndent() + "JS MO: [" + property + "=" + to[property] + "]");
            }
        }
        else if(isRequired) {
            console.log("Required property " + property + " not found in smil node " + from.nodeType);
        }
    };

    var createNodeFromDTO = function(nodeDTO, parent) {

        var node;

        if(nodeDTO.nodeType == "seq") {

            if (smilModel.mo.DEBUG)
            {
            console.log(getIndent() + "JS MO seq");
            }

            node = new Smil.SeqNode(parent);

            safeCopyProperty("textref", nodeDTO, node, ((parent && parent.parent) ? true : false));
            safeCopyProperty("id", nodeDTO, node);
            safeCopyProperty("epubtype", nodeDTO, node);

            if (node.epubtype)
            {
                node.getSmil().addSync(node.epubtype);
            }
            
            indent++;
            copyChildren(nodeDTO, node);
            indent--;
        }
        else if (nodeDTO.nodeType == "par") {

            if (smilModel.mo.DEBUG)
            {
            console.log(getIndent() + "JS MO par");
            }

            node = new Smil.ParNode(parent);

            safeCopyProperty("id", nodeDTO, node);
            safeCopyProperty("epubtype", nodeDTO, node);

            if (node.epubtype)
            {
                node.getSmil().addSync(node.epubtype);
            }

            indent++;
            copyChildren(nodeDTO, node);
            indent--;
            
            for(var i = 0, count = node.children.length; i < count; i++) {
                var child = node.children[i];

                if(child.nodeType == "text") {
                    node.text = child;
                }
                else if(child.nodeType == "audio") {
                    node.audio = child;
                }
                else {
                    console.error("Unexpected smil node type: " + child.nodeType);
                }
            }

////////////////
var forceTTS = false; // for testing only!
////////////////

            if (forceTTS || !node.audio)
            {
                // synthetic speech (playback using TTS engine), or embedded media, or blank page
                var fakeAudio = new Smil.AudioNode(node);

                fakeAudio.clipBegin = 0;
                fakeAudio.clipEnd = fakeAudio.MAX;
                fakeAudio.src = undefined;

                node.audio = fakeAudio;
            }
        }
        else if (nodeDTO.nodeType == "text") {

            if (smilModel.mo.DEBUG)
            {
            console.log(getIndent() + "JS MO text");
            }

            node = new Smil.TextNode(parent);

            safeCopyProperty("src", nodeDTO, node, true);
            safeCopyProperty("srcFile", nodeDTO, node, true);
            safeCopyProperty("srcFragmentId", nodeDTO, node, false);
            safeCopyProperty("id", nodeDTO, node);
            
            node.updateMediaManifestItemId();
        }
        else if (nodeDTO.nodeType == "audio") {

            if (smilModel.mo.DEBUG)
            {
            console.log(getIndent() + "JS MO audio");
            }

            node = new Smil.AudioNode(parent);

            safeCopyProperty("src", nodeDTO, node, true);
            safeCopyProperty("id", nodeDTO, node);

            safeCopyProperty("clipBegin", nodeDTO, node);
            if (node.clipBegin && node.clipBegin.length && node.clipBegin.length > 0)
            {
                console.error("SMIL clipBegin is string, parsing float... (" + node.clipBegin + ")");
                node.clipBegin = parseFloat(node.clipBegin);
            }
            if (node.clipBegin < 0)
            {
                if (smilModel.mo.DEBUG)
                {
                    console.log(getIndent() + "JS MO clipBegin adjusted to ZERO");
                }
                node.clipBegin = 0;
            }

            safeCopyProperty("clipEnd", nodeDTO, node);
            if (node.clipEnd && node.clipEnd.length && node.clipEnd.length > 0)
            {
                console.error("SMIL clipEnd is string, parsing float... (" + node.clipEnd + ")");
                node.clipEnd = parseFloat(node.clipEnd);
            }
            if (node.clipEnd <= node.clipBegin)
            {
                if (smilModel.mo.DEBUG)
                {
                    console.log(getIndent() + "JS MO clipEnd adjusted to MAX");
                }
                node.clipEnd = node.MAX;
            }
            
            //node.updateMediaManifestItemId(); ONLY XHTML SPINE ITEMS 
        }
        else {
            console.error("Unexpected smil node type: " + nodeDTO.nodeType);
            return undefined;
        }

        return node;

    };

    var copyChildren = function(from, to) {

        var count = from.children.length;

        for(var i = 0; i < count; i++) {
            var node = createNodeFromDTO(from.children[i], to);
            node.index = i;
            to.children.push(node);
        }

    };

    copyChildren(smilDTO, smilModel);

    return smilModel;

};

return SmilModel;
});
