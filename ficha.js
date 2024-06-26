let requerTreino = {
    "Acrobacia"     :0,
    "Adestramento"  :1,
    "Atletismo"     :0,
    "Atuação"       :0,
    "Cavalgar"      :0,
    "Conhecimento"  :1,
    "Cura"          :0,
    "Diplomacia"    :0,
    "Enganação"     :0,
    "Fortitude"     :0,
    "Furtividade"   :0,
    "Guerra"        :1,
    "Iniciativa"    :0,
    "Intimidação"   :0,
    "Intuição"      :0,
    "Investigação"  :0,
    "Jogatina"      :1,
    "Ladinagem"     :1,
    "Luta"          :0,
    "Misticismo"    :1,
    "Nobreza"       :1,
    "Ofício1"       :1,
    "Ofício2"       :1,
    "Percepção"     :0,
    "Pilotagem"     :1,
    "Pontaria"      :0,
    "Reflexos"      :0,
    "Religião"      :1,
    "Sobrevivência" :0,
    "Vontade"       :0,
};

let requerPenalidadeEquipamentos = {
    "Acrobacia"     :1,
    "Adestramento"  :0,
    "Atletismo"     :0,
    "Atuação"       :0,
    "Cavalgar"      :0,
    "Conhecimento"  :0,
    "Cura"          :0,
    "Diplomacia"    :0,
    "Enganação"     :0,
    "Fortitude"     :0,
    "Furtividade"   :1,
    "Guerra"        :0,
    "Iniciativa"    :0,
    "Intimidação"   :0,
    "Intuição"      :0,
    "Investigação"  :0,
    "Jogatina"      :0,
    "Ladinagem"     :1,
    "Luta"          :0,
    "Misticismo"    :0,
    "Nobreza"       :0,
    "Ofício1"       :0,
    "Ofício2"       :0,
    "Percepção"     :0,
    "Pilotagem"     :0,
    "Pontaria"      :0,
    "Reflexos"      :0,
    "Religião"      :0,
    "Sobrevivência" :0,
    "Vontade"       :0,
};

let cores = {
    "Força"        :"#B02E0C",
    "Destreza"     :"#F7A9A8",
    "Constituição" :"#ADAABF",
    "Inteligência" :"#7494EA",
    "Sabedoria"    :"#50C5B7",
    "Carisma"      :"#DBD56E",
};

function byteToStr(bytes) {
    return new TextDecoder().decode(new Uint8Array(bytes));
}

function check_ok(str) {
    if(str.includes("STRINGBEMGRANDEPRANAOTERERRO")) {
        return str;
    }

    return "{}";
}

function strToByte(str) {
    return new TextEncoder().encode(str);
}

function encrypt(key, message) {

    function update(array) {
        let output = [];
        for(let i = 0; i < array.length; i += 1) {
            if(i == 0) {
                output.push(array[i]);
            } else {
                output.push(array[i] ^ array[array.length - i]);
            }
        }
        return output;
    }

    key = update(key);

    let key_len = key.length;
    let mes_len = message.length;

    let key_pos = 0;
    let mes_pos = 0;

    let output = [];

    while(true) {
        if(mes_pos == mes_len) {
            break;
        } else {
            output.push(message[mes_pos] ^ key[key_pos]);
            key_pos += 1;
            mes_pos += 1;
            key_pos = key_pos % key_len;
        }
    }

    return output;
}

function mudar_aba(with_class_page, target) {
    let abas = document.getElementsByClassName("aba");
    for(let aba of abas) {
        aba.style.display = "none";
    }

    let aba_target = document.getElementById("aba_" + target);
    aba_target.style.display = "block";

    let paginas = document.getElementsByClassName("page");
    for(let pagina of paginas) {
        pagina.classList.remove("currentPage")
    }

    with_class_page.classList.add("currentPage")
    // carregar_player(player_data);
}

function deu_ruim() {
    document.getElementsByClassName("pagina_ficha")[0].innerHTML = "Deu ruim, foi mal.";
    document.getElementsByClassName("pagina_ficha")[0].style.display = "block";
}

function carregar_pagina() {
    let key_str = prompt("Diz a senha", "");
    let key = strToByte(key_str);

    for(let player of player_data) {
        let data = player.player;
        player.player = JSON.parse(check_ok(byteToStr(encrypt(key, data))));
    }

    player_data = player_data.filter((player) => player.player.check === "STRINGBEMGRANDEPRANAOTERERRO");

    if(player_data.length == 1) {
        player_data = player_data[0].player;
        carregar_player(player_data);
    } else {
        deu_ruim();
    }
}

function carregar_player_geral(data) {
    document.getElementsByClassName("pagina_ficha")[0].style.display = "block";

    document.getElementById("nome_principal").innerHTML = data["Nome"];

    document.getElementById("charname").innerHTML = data["nome_curto"];
    document.getElementById("raca").innerHTML = data["Raça"];
    document.getElementById("divindade").innerHTML = data["Divindade"];
    document.getElementById("classe").innerHTML = data["Classe"];
    document.getElementById("origem").innerHTML = data["Origem"];
    document.getElementById("nivel").innerHTML = data["Nivel"];
    document.getElementById("xp").innerHTML = data["Exp"];

    document.getElementById("forca").innerHTML = data["Força"]
    document.getElementById("destreza").innerHTML = data["Destreza"];
    document.getElementById("constituicao").innerHTML = data["Constituição"];
    document.getElementById("inteligencia").innerHTML = data["Inteligência"];
    document.getElementById("sabedoria").innerHTML = data["Sabedoria"];
    document.getElementById("carisma").innerHTML = data["Carisma"];

    document.getElementById("descricao").innerHTML = data["Descrição"].replaceAll(" ", "  ").replaceAll(")  ", ")  <br>");

    let pv = data["PV"];
    let pm = data["PM"];

    let max_pv = data["MAX_PV"];
    let max_pm = data["MAX_PM"];

    document.getElementById("pv").innerHTML = pv;
    document.getElementById("max_pv").innerHTML = max_pv;
    document.getElementById("pm").innerHTML = pm;
    document.getElementById("max_pm").innerHTML = max_pm;

    let razao_pv = pv / max_pv;
    document.getElementById("bar_pv").style.width = "" + (razao_pv * 100) + "%";

    if(max_pm > 0) {
        let razao_pm = pm / max_pm;
        document.getElementById("bar_pm").style.width = "" + (razao_pm * 100) + "%";
    } else {
        document.getElementById("bar_pm").style.width = "0%";
    }

    document.getElementById("img_ficha_id").src = "imgs/" + data.image;
}


function bonusTreinoNivel(nivel) {
    if(nivel <= 6) {
        return 2;
    }

    if(nivel >= 15){
        return 6;
    }

    return 4;
}

function carregar_player_pericias(data) {
    let todas_pericias = ["Acrobacia", "Adestramento", "Atletismo", "Atuação", "Cavalgar", "Conhecimento", "Cura", "Diplomacia", "Enganação", "Fortitude", "Furtividade", "Guerra", "Iniciativa", "Intimidação", "Intuição", "Investigação", "Jogatina", "Ladinagem", "Luta", "Misticismo", "Nobreza", "Ofício1", "Ofício2", "Percepção", "Pilotagem", "Pontaria", "Reflexos", "Religião", "Sobrevivência", "Vontade"];

    let tabela = document.getElementById("body_tabela_pericias");
    tabela.innerHTML = "";

    let penalidadeEscudo = data.Escudo.penalidadeEscudo;
    let penalidadeArmadura = data.Armadura.penalidadeArmadura;
    let outrosPenalidadeArmadura = data["OutrosPenalidadeArmadura"];
    let nivel = data["Nivel"];

    let nome_of1 = data["NomeOficio1"];
    let nome_of2 = data["NomeOficio2"];

    for(let pericia of todas_pericias) {

        let essa_requerTreino = requerTreino[pericia];
        let essa_requerPenalidadeEquipamentos = requerPenalidadeEquipamentos[pericia];
        let nome_atributo = data["" + pericia + "Usa"];
        let cor = cores[nome_atributo];
        let temTreino = data["TemTreinoEm" + pericia];
        let bonus_treino = bonusTreinoNivel(nivel)
        let total = Math.floor(nivel / 2) + data[nome_atributo] + temTreino * bonus_treino + data[pericia];

        if(essa_requerTreino == 1) {
            total = total * temTreino;
        }

        total = total - (essa_requerPenalidadeEquipamentos * (penalidadeEscudo + penalidadeArmadura + outrosPenalidadeArmadura));

        let nome_pericia = pericia;
        nome_pericia = nome_pericia.replace("1","(" +  nome_of1 + ")");
        nome_pericia = nome_pericia.replace("2", "(" + nome_of2 + ")");

        if(essa_requerTreino == 1) {
            nome_pericia += "*";
        }

        if(essa_requerPenalidadeEquipamentos == 1) {
            nome_pericia += "✝";
        }

        let pericia_completo = `
        <tr>
            <td class="nome_pericia" onclick="teste_pericia(this.parentNode)">${nome_pericia}</td>
            <td>${total}</td>
            <td>${Math.floor(nivel / 2)}</td>
            <td style="background-color: ${cor}">${data[nome_atributo]} (${nome_atributo})</td>
            <td>${temTreino * bonus_treino}</td>
            <td>${data[pericia]}</td>
        </tr>`;

        tabela.innerHTML += pericia_completo;
    }
}

function carregar_player_defesa(data) {

    let destreza = data["Destreza"];
    let outrosPenalidadeArmadura = data["OutrosPenalidadeArmadura"];
    let outrosDefesa = data["OutrosDefesa"];

    let penalidadeEscudo = data.Escudo.penalidadeEscudo;
    let penalidadeArmadura = data.Armadura.penalidadeArmadura;
    let defesaEscudo = data.Escudo.defesaEscudo;
    let defesaArmadura = data.Armadura.defesaArmadura;
    let nomeEscudo = data.Escudo.nomeEscudo;
    let nomeArmadura = data.Armadura.nomeArmadura;

    let penalidadeTotal = -1 * (penalidadeArmadura + penalidadeEscudo + outrosPenalidadeArmadura);
    let defesaTotal = 10 + destreza + defesaArmadura + defesaEscudo + outrosDefesa;

    document.getElementById("defesaTotal"              ).innerHTML = defesaTotal;
    document.getElementById("defesa_destreza"          ).innerHTML = destreza;
    document.getElementById("defesa_defesaArmadura1"   ).innerHTML = defesaArmadura;
    document.getElementById("defesa_defesaEscudo1"     ).innerHTML = defesaEscudo;
    document.getElementById("defesa_OutrosDefesa"      ).innerHTML = outrosDefesa;
    document.getElementById("defesa_penalidadeTotal"   ).innerHTML = penalidadeTotal;
    document.getElementById("defesa_nomeArmadura"      ).innerHTML = nomeArmadura;
    document.getElementById("defesa_defesaArmadura2"   ).innerHTML = defesaArmadura;
    document.getElementById("defesa_penalidadeArmadura").innerHTML = penalidadeArmadura;
    document.getElementById("defesa_nomeEscudo"        ).innerHTML = nomeEscudo;
    document.getElementById("defesa_defesaEscudo2"     ).innerHTML = defesaEscudo;
    document.getElementById("defesa_penalidadeEscudo"  ).innerHTML = penalidadeEscudo;
}

function carregar_player_itens(data) {
    let items = data.Items;
    let tabela = document.getElementById("body_tabela_items");
    tabela.innerHTML = "";
    for(let item of items) {
        let localizacao  = item.Location;
        let nome = item.Name;
        let qtd = item.Qty;
        let descricao = item.Description;
        if (localizacao === nome) {
            localizacao = "Solto nos bolso";
        }
        let item_completo = `
        <tr>
            <td>${nome}</td>
            <td>${descricao}</td>
            <td>${qtd}</td>
            <td>${localizacao}</td>
        </tr>`;
        tabela.innerHTML += item_completo;
    }
}

function dragElement(elmnt, popup) {
    if(popup) {
        let janelas = document.getElementsByClassName("janela_flutuante");
        let mmax = 8;
        let max = mmax;
        for(let janela of janelas) {
            if(janela.style.zIndex === "") {
                janela.style.zIndex = mmax;
            }
            max = Math.max(max, janela.style.zIndex)
        }

        elmnt.style.zIndex = max + 1;
    }

    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    let item = document.getElementById(elmnt.id + "_cabecalho");
    if(item) {
        item.onmousedown = dragMouseDown;
    }


    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}



function abrir_janela(id, titulo, html_txt, remover_hr=false) {

    if(document.getElementById(id)) {
        return false;
    }

    let html_janela = `
<div id="${id}" class='janela_flutuante' onclick='dragElement(this, true)' onmouseenter='dragElement(this, false)'>

    <div id="${id + '_cabecalho'}" class='janela_flutuante_cabecalho'>
        ${titulo}
        <span onclick='this.parentNode.parentNode.remove()' class='botao_fechar'></span>
    </div>

    <div style="overflow: scroll;height: 78%;">
        ${html_txt}
        <br>
        <br>
        <hr>
    </div>

    <div id="${id + '_rodape'}" class='janela_flutuante_rodape'>
        <span class='botao_resize'></span>
    </div>
</div>`;



    if(remover_hr) {
        html_janela = html_janela.replace("<hr>", "");
    }

    document.body.innerHTML += html_janela;


    let resizes = document.getElementsByClassName("botao_resize");
    for(let resize of resizes) {
        resize.addEventListener('mousedown', init_drag);
    }

    return true;
}

function abrir_janela_habilidades(tag_a) {
    let habilidade = comp_poderes[tag_a.attributes["habilidade_id"].value];

    let poder_html = `
    <h3>${habilidade.nome}</h3>
    <h6>Habilidade/Poder ${habilidade.tipo}</h6>
    <p style="padding: 15px;">${habilidade.descricao}</p>
    <hr>
    ID: ${habilidade.id}`;

    abrir_janela(habilidade.id, habilidade.nome, poder_html);
}

function carregar_habilidades(data) {
    let aba = document.getElementById("div_poderes");
    aba.innerHTML = "";
    let habilidades_ids = data["Habilidades"];
    for(let habilidade_id of habilidades_ids) {
        let nome_habilidade = comp_poderes[habilidade_id]["nome"];
        aba.innerHTML += `<a href='#' habilidade_id='${habilidade_id}' onclick='abrir_janela_habilidades(this)'>${nome_habilidade}</a>`;
        aba.innerHTML += "<br>";
    }
}

function abrir_janela_magias(tag_a) {
    let magia = comp_magias[tag_a.attributes["habilidade_id"].value];


    let magia_html = `

    <h3>${magia.nome}</h3>
    <h6>Magia ${magia.tipo} de ${magia.circulo} circulo, escola de ${magia.escola}</h6>

    <ul>
        <li><b>Alcance: </b>${magia.alcance}</li>
        <li><b>Alvo: </b>${magia.alvo}</li>
        <li><b>Duração: </b>${magia.duracao}</li>
        <li><b>Execução: </b>${magia.execucao}</li>
        <li><b>Resistência: </b>${magia.resistencia}</li>
    </ul>

    <p style="padding: 15px;">${magia.descricao}</p>
    <h4>Opções</h4>`;


    for(let opcao of magia.opcoes) {
        magia_html += `<b>+${opcao[0]} PM</b>: ${opcao[1]}`;
        magia_html += "<br><br>";
    }

    magia_html += `<hr>ID: ${magia.id}`;
    abrir_janela(magia.id, magia.nome, magia_html);
}


function carregar_magias(data) {
    let aba = document.getElementById("div_magias");
    aba.innerHTML = "";
    let magias_ids = data["Magias"];
    for(let magia_id of magias_ids) {
        let nome_magia = comp_magias[magia_id]["nome"];
        aba.innerHTML += `<a href='#' habilidade_id='${magia_id}' onclick='abrir_janela_magias(this)'>${nome_magia}</a>`;
        aba.innerHTML += "<br>";
    }
}


function carregar_player(data) {
    carregar_player_geral(data);
    carregar_player_pericias(data);
    carregar_player_defesa(data);
    carregar_player_itens(data);
    carregar_habilidades(data);
    carregar_magias(data);
    document.title = "Ficha de " + data.nome_curto;
}



let janela, startX, startY, startWidth, startHeight;

function init_drag(e) {
    janela = e.target.parentNode.parentNode;

    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(document.defaultView.getComputedStyle(janela).width, 10);
    startHeight = parseInt(document.defaultView.getComputedStyle(janela).height, 10);

    document.body.addEventListener('mousemove', do_drag);
    document.body.addEventListener('mouseup', stop_drag);

    for(let el of document.getElementsByTagName("*")) {
        el.classList.add("select_desabilitado")
    }

}

function do_drag(e) {
    if(janela) {
        janela.style.width = (startWidth + e.clientX - startX) + 'px';
        janela.style.height = (startHeight + e.clientY - startY) + 'px';
        // console.log(janela.children[janela.children.length - 1].children[0]);
    }
    e.preventDefault();
}

function stop_drag(e) {

    if(janela) {
        janela.children[janela.children.length - 1].children[0].removeEventListener('mousemove', do_drag);
        janela.children[janela.children.length - 1].children[0].removeEventListener('mouseup', stop_drag);
    }

    janela = undefined;
    startX = 0;
    startY = 0;
    startHeight = 0;
    startWidth = 0;
    e.preventDefault();

    for(let el of document.getElementsByTagName("*")) {
        el.classList.remove("select_desabilitado")
    }

}
