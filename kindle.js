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


function adddict(word, desc) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/wordbook/wordlist?action=add", true)
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var params = "word=" + encodeURIComponent(word) + "&desc=" + encodeURIComponent(desc) + "&tags=kindle"

    xhr.send(params)
}

function rundb(db) {
    var prompt = document.createElement("span")
    document.body.insertBefore(prompt, document.body.firstChild);
    prompt.innerHTML = "PROCESSING..."

    function _add(w) {
        var key = w[0]
        var ww = w[1]
        var stem = w[2]

        var lookups = db.exec("Select * From LOOKUPS Where word_key == '{}';".replace("{}", key))
        var l = lookups[0].values
        var desc = ""
        for (var i in l) {
            var entry = l[i]

            var text = entry[5]
            var bookinfo = db.exec("Select * From BOOK_INFO Where id == '{}'".replace("{}", entry[2]))
            var booktitle = bookinfo[0].values[0][4]

            desc += text + "\n -- \n" + booktitle + "\n\n"
        }

        adddict(ww, desc)
    }

    var result = db.exec("Select * From Words Where id like 'en:%';");
    var words = result[0].values
    for (var i in words) {
        _add(words[i])
    }

    prompt.innerHTML = "DONE WITH "+ words.length + " WORDS!"
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
