
if(Array.from == null){
    Array.from = function(args){return [].slice.call(args)};
}

jQuery(document).ready(function(){
    var content = document.body.querySelector("#main_content"),
        topDiv = content.querySelector(".ptg-top"),
        searchDiv = topDiv.querySelector(".ptg-search"),
        buttons = Array.from(searchDiv.querySelectorAll("button")),
        prev = buttons[0],
        next = buttons[1],
        input = searchDiv.querySelector("input[type='search']"),
        mask = document.createElement("div"),
        term,
        selection,
        rangeIndex,
        ranges,
        list;

    resetContent(content);

    mask.className = "ptg-mask";
    mask.innerHTML = "<span class='ptg-close'></span>";
    document.body.appendChild(mask);

    prev._action = "prev";
    next._action = "next";

    jQuery(input)
    .on("input", function(e){
        var text = input.value.replace(/\s+$|^\s+/g, "");
        if(text.length > 0){
            next.disabled = prev.disabled = false;
        }else{
            next.disabled = prev.disabled = true;
        }
        jQuery("#main_content").removeClass("pdt-search");
        e.stopPropagation();
    })
    .on("keyup", function(e){
        var e0 = e.originalEvent;
        switch(e.which){
          case 13:
            if(e0.shiftKey){
                __highlight(prev, true);
                setTimeout(function(){
                    __highlight(prev, false);
                    prev.click();
                }, 200);
            }else{
                __highlight(next, true);
                setTimeout(function(){
                    __highlight(next, false);
                    next.click();
                }, 200);
            }
            break;

          default:
            break;
        }
        e.stopPropagation();
    });

    jQuery("button", searchDiv)
    .on("click", function(e){
        var b = e.currentTarget;
        switch(b._action){
          case 'next':
            selectNext();
            break;
          case 'prev':
            selectPrev();
            break;
        }
        e.stopPropagation();
    })
    .on("mousedown", {pressed: true}, _highlight)
    .on("mouseup", {pressed: false}, _highlight)
    .on("mouseout", {pressed: false}, _highlight);

    jQuery(document)
    .on("scroll", function(e){
        var b = topDiv.getBoundingClientRect(),
            text = (input.value || "").replace(/\s+$|^\s+/g, "");
        jQuery(searchDiv).toggleClass("ptg-fixed", term != null && b.top < 0 && text.length > 0);
        jQuery(mask).toggleClass("ptg-fixed", term != null && b.top < 0 && text.length > 0);
    });

    jQuery(".ptg-close", mask)
    .on("click", function(e){
        term = null;
        jQuery(mask).fadeOut(200, function(){
            jQuery(mask)
            .removeClass("ptg-fixed")
            .css({
                opacity: "",
                display: ""
            });
            jQuery(searchDiv)
            .fadeOut(100, function(){
                jQuery(searchDiv)
                .removeClass("ptg-fixed")
                .css({
                    opacity: "",
                    display: ""
                });
            });
        });
    });

    jQuery("#main_content")
    .on("click", "a[aria-expanded], .pdt-icon", function(e){
        var h = e.currentTarget.parentElement,
            a = h.querySelector("a[aria-expanded]"),
            div = h.nextElementSibling,
            expand = a.getAttribute("aria-expanded") != "true";

        if(expand){
            jQuery(div).slideDown(200, function(){
                jQuery(div).css({
                    display: ""
                });
            });
        }else{
            jQuery(div)
            .css({
                display: "block"
            })
            .slideUp(200, function(){
                jQuery(div).css({
                    display: ""
                });
            });
        }
        jQuery(h).toggleClass("pdt-collapsed", !expand);
        a.setAttribute("aria-expanded", String(expand));
        a.title = expand ? "Click to collapse" : "Click to expand";
    });

    jQuery(document.body)
    .on("click", function(e){
        jQuery("#main_content").removeClass("pdt-search");
    })

    function selectNext(){
        var text = input.value.replace(/\s+$|^\s+/g, "");
        if(text.length == 0){
            return;
        }

        getRanges(text);
        if(ranges.length > 0){
            if(rangeIndex == null){
                rangeIndex = 0;
            }else{
                rangeIndex = (rangeIndex + 1) % ranges.length;
            }
            showRange(ranges[rangeIndex]);
        }
    }

    function selectPrev(){
        var text = input.value.replace(/\s+$|^\s+/g, "");
        if(text.length == 0){
            return;
        }

        if(ranges.length > 0){
            if(rangeIndex == null){
                rangeIndex = 0;
            }else{
                rangeIndex = (rangeIndex - 1 + ranges.length) % ranges.length;
            }
            showRange(ranges[rangeIndex]);
        }
    }

    function getRanges(text){
        if(list == null){ // create list of text nodes
            var top = document.body.querySelector(".ptg-top"),
                content = top.nextElementSibling,
                treeWalker = document.createTreeWalker(content, NodeFilter.SHOW_TEXT, null, false);
            list = [];
            while(treeWalker.nextNode()){
                list.push(treeWalker.currentNode);
            }
        }

        selection = selection || document.getSelection();

        if(text != term){
            term = text;
            ranges = [];
            rangeIndex = null;

            selection.removeAllRanges();
            list.forEach(function(n){
                var re = new RegExp(text, "ig"),
                    a;
                while((a = re.exec(n.data)) != null){
                    var range = document.createRange();
                    range.setStart(n, a.index);
                    range.setEnd(n, a.index + a[0].length);
                    ranges.push(range);
                }
            });
        }
        return ranges;
    }

    function showRange(range){
        var p = range.startContainer,
            h,
            expanded;
        while(p = p.parentNode){
            // check if accordion
            if(jQuery(p).hasClass("usa-accordion-content")){
                var a = p.getAttribute("aria-hidden"), b = p;
                if(a && a != "false"){
                    p.setAttribute("aria-hidden", "false");
                }
                while(b = b.previousElementSibling){
                    if(jQuery(b).hasClass("usa-accordion-button")){
                        var a = b.getAttribute("aria-expanded");
                        if(a && a != "true"){
                            b.setAttribute("aria-expanded", "true");
                        }
                        break;
                    }
                }
                break;
            }else
            // check for expanded H*
            if((h = p.previousElementSibling) != null && h.nodeName.match(/h[2-6]/i)){
                var a = h.querySelector("a[aria-expanded]");
                if(a){
                    jQuery(h).removeClass("pdt-collapsed");
                    a.setAttribute("aria-expanded", "true");
                    a.title = "Click to collapse";
                }
            }
        }
        jQuery("#main_content").addClass("pdt-search");
        if(typeof range.getBoundingClientRect == 'function'){
            try{
                var b = range.getBoundingClientRect(),
                    h = window.innerHeight,
                    body = document.scrollingElement || document.documentElement,
                    dy = jQuery(body).scrollTop(),
                    dh = Math.floor(h/8);

                if(b.top < 0){
                    jQuery(body).scrollTop(Math.max(0, b.top + dy - dh));
                }else
                if(b.top + b.height > h){
                    jQuery(body).scrollTop(Math.max(0, b.top + b.height + dy - h + dh));
                }
            }catch(e){
                console.error(e);
            }
        }
        setTimeout(function(){
            selection.removeAllRanges();
            selection.addRange(ranges[rangeIndex]);
        }, 100);
   }

    function _highlight(e){
        var b = e.currentTarget;
        __highlight(b, Boolean(e.data.pressed));
    }

    function __highlight(b, flag){
        jQuery(b).toggleClass('pdt-pressed', flag);
    }

    function resetContent(content){
        var list = Array.from(content.querySelectorAll("h2,h3,h4,h5,h6"));
        list.forEach(function(h){
            var t = h.getAttribute("aria-expanded");
            if(t != null){
                var a = document.createElement("a"),
                    div = document.createElement("div"),
                    span = document.createElement("span"),
                    expanded = t == "true",
                    r = Number(h.nodeName.charAt(1)),
                    el;
                if(h.nextElementSibling){
                    h.parentElement.insertBefore(div, h.nextElementSibling);
                }else{
                    h.parentElement.appendChild(div);
                }

                h.innerHTML = "<span class='pdt-icon'></span><a name='" + h.id + "' aria-expanded='" + String(expanded) + "' title='" + (expanded ? "Click to collapse" : "Click to expand") + "'>" + h.innerHTML + "</a>";
                h.removeAttribute("aria-expanded");
                jQuery(h)
                .toggleClass("pdt-collapsed", !expanded)
                .addClass("pdt-header");
                div.className = "pdt-content";

                while((el = div.nextElementSibling)){
                    var re = /h([2-6])/i,
                        s = re.exec(el.nodeName);
                    if(s != null && Number(s[1]) <= r){ // same or heigher header
                        break;
                    }
                    el.parentElement.removeChild(el);
                    div.appendChild(el);
                }
            }
        });
    }
});
