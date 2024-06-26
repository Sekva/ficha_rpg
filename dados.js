function abrir_janela_dados() {
    let html_dados = `
<div class="btns_dados">
  <span class="btn_dado">d3</span>
  <span class="btn_dado">d4</span>
  <span class="btn_dado">d6</span>
  <span class="btn_dado">d8</span>
  <span class="btn_dado">d10</span>
  <span class="btn_dado">d12</span>
  <span class="btn_dado">d20</span>
  <span class="btn_dado">d100</span>
</div>
<br>
<p style="display:contents">
Número de dados: <input id="n_dados" style="width: 45px" type="number" min="1" value="1">
</p>
<br>
<br>
<p style="display:contents"><ul id="listagem_dados"></ul></p>
`;

    abrir_janela("janela_dice_box", "Dados", html_dados, true);
    for(let btn of document.getElementsByClassName("btn_dado")) {
        btn.onclick = botao_dado_clicado;
    }


    let janela = document.getElementById("janela_dice_box");
    janela.style.top = "10px";
    janela.style.right = "10px";
}



function botao_dado_clicado(evt) {
    let notacao = "" + document.getElementById("n_dados").value + evt.target.innerHTML;
    lancar_dados(notacao);
}

function limpar_dados() {
    document.getElementById("listagem_dados").innerHTML = "";
}

function lancar_dados(notacao, prefixo="") {
    abrir_janela_dados();
    let resultado = new rpgDiceRoller.DiceRoller().roll(notacao);
    document.getElementById("listagem_dados").innerHTML += "<li>" + prefixo + resultado + "</li>";
}

function teste_atributo(div) {
    let nome_atributo = div.children[0].innerHTML;
    let valor_atributo = div.children[2].innerHTML;
    lancar_dados(`1d20+${valor_atributo}`, nome_atributo + ": ");
}

function teste_pericia(linha_tabela) {
    let nome_pericia = linha_tabela.children[0].innerHTML;
    let bonus_pericia = linha_tabela.children[1].innerHTML;
    lancar_dados(`1d20+${bonus_pericia}`, nome_pericia + ": ");
}
