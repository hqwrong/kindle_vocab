function post(path, params, method) {
    method = method || "post"; // Set method to post by default if not specified.

    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);

    for(var key in params) {
        var hiddenField = document.createElement("input");
        hiddenField.setAttribute("type", "hidden");
        hiddenField.setAttribute("name", key);
        hiddenField.setAttribute("value", params[key]);

        form.appendChild(hiddenField);
    }

    document.body.appendChild(form);
    form.submit();
}

function rundb(db) {
    var result = db.exec("Select * From Words Where id like 'en:%';");
    var words = result[0].values
    console.log(words)
    // for (var i in words) {
    //     var w = words[i]
    //     var key = w[0]
    //     var ww = w[1]
    //     var stem = w[2]

    //     var lookups = db.exec("Select * From LOOKUPS Where word_key == '?';", key)
    //     console.log(lookups)
    // }
}

function loaddb() {
    function onfile(evt) {
        var files = evt.target.files
        window.alert(files[0].name)
    }

    var f = document.createElement("input")
    f.setAttribute("type", "file")
    f.innerHTML = "LoadFile";
    f.onchange = function() {
        var r = new FileReader();
        r.onload = function() {
            var Uints = new Uint8Array(r.result);
            var db = new SQL.Database(Uints);

            rundb(db)
        }
        r.readAsArrayBuffer(f.files[0]);
    }

    document.body.insertBefore(f, document.body.firstChild);
}


function main() {
    loaddb();
}

main()
