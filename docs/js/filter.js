var index = {};
function buildIndex() {
    index = {};
    for(let node of data) {
        if(index[node.id] !== undefined) {
            alert("Duplicate ID " + node.id + ": " + node.title + " and " + index[node.id].title);
        }
        index[node.id] = node;
    }
}

function hasParent(node, parent_id) {
    var parent = node;
    while(parent !== undefined && parent.father != null) {
        parent = index[parent.father];
        if(parent === undefined) return false;
        if(parent.id == parent_id) return true;
    }
    return false;
}

function hasChild(node, child_id) {
    var child = index[child_id];
    return hasParent(child, node.id);
}

function toggle(filterInclude) {
    current_data = [];
    for(let node of data) 
        if(filterInclude(node)) current_data.push(node);
    // remove empty groups
    var removed;
    do {
        removed = 0;
        var has_children = {};
        for(let node of current_data) {
            if(node.father !== null) has_children[node.father] = true;
        }
        var cleaned_data = [];
        for(let node of current_data) {
            if(has_children[node.id] !== undefined || node.color != color.group) {
                cleaned_data.push(node);
            } else {
                removed++;
            }
        }    
        current_data = cleaned_data;
    } while(removed);
    
    tree.refresh(current_data);
}

function recursiveFlatten(input) {
    result = "";
    if(typeof(input) == "string") {
        result += input + " ";
    }
    else if(typeof(input) == "object") {
        if(Array.isArray(input)) {
            for(let element of input) {
                result += recursiveFlatten(element) + " ";
            }
        } else {
            for(let key of Object.keys(input)) {
                result += recursiveFlatten(input[key]) + " ";
            }
        }
    }
    return result;
}

function filter() {

    var show_intel = $("#toggleIntel").prop("checked");
    var show_arm = $("#toggleARM").prop("checked");
    var show_amd = $("#toggleAMD").prop("checked");
    var show_riscv = $("#toggleRISC-V").prop("checked");

    // var search_term = $("#search").val();    
    // var has_search = search_term.trim().length > 0;
    
    toggle(function(node) {
        var is_leaf = node.color != color.group && node.color != color.root;
        
        var include = false;
        if(node.affects !== undefined) {
            for(let a of node.affects) {
                if(a.title === "Intel" && show_intel) {
                    include = true;
                    break;
                }
                if(a.title === "AMD" && show_amd) {
                    include = true;
                    break;
                }
                if(a.title === "ARM" && show_arm) {
                    include = true;
                    break;
                }
                if(a.title === "RISC-V" && show_riscv) {
                    include = true;
                    break;
                }
            }
            if (!include) return false;
        }
         
        // if(has_search && is_leaf) {
        //     if(node.description.toLowerCase().indexOf(search_term.toLowerCase()) == -1 &&
        //        node.title.toLowerCase().indexOf(search_term.toLowerCase()) == -1 &&   
        //        (node.alias||"").toLowerCase().indexOf(search_term.toLowerCase()) == -1 &&
        //        (node.affects||[]).map(x => x.title||x).join(" ").toLowerCase().indexOf(search_term.toLowerCase()) == -1 &&
        //        (node.names||[]).map(x => x.title||x).join(" ").toLowerCase().indexOf(search_term.toLowerCase()) == -1 &&
        //        recursiveFlatten(node.sources).toLowerCase().indexOf(search_term.toLowerCase()) == -1 &&
        //        (node.cve||[]).map(x => x.title||x).join(" ").toLowerCase().indexOf(search_term.toLowerCase()) == -1 &&
        //        (node.poc||[]).map(x => x.title||x).join(" ").toLowerCase().indexOf(search_term.toLowerCase()) == -1
        //     ) return false;
        //     /* automatically popup the first leaf hit when searching */
        //     else if(!search_popup) {
        //         search_popup = 1;
        //         popup(node);
        //     }
        // }
        return true;
    }
    );
} 
