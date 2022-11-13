////////////////
window.addEventListener('load', (evnt) => {
    changeGridDim()
})
window.addEventListener('resize', (evnt) => {
    changeGridDim()
})

//[same as mediaQuery] at 900 650 400
function changeGridDim() {
    const nodes = document.querySelector('.nodes')
    const windowWidth = parseInt(window.document.body.clientWidth)

    const dimes = nodes.getBoundingClientRect()
    const cmpStules = window.getComputedStyle(nodes);
    const scrollBarWidth = dimes.width - nodes.clientWidth
    let totalCols = 10
    if (windowWidth <= 400) {
        totalCols = 3
    }
    else if (windowWidth <= 650) {
        totalCols = 5
    }
    else if (windowWidth <= 900) {
        totalCols = 8
    }


    const colWidth = (dimes.width - scrollBarWidth - cmpStules.padding.split('px', 1)[0] * 2) / totalCols
    nodes.style['grid-template-columns'] = `repeat(${totalCols},${colWidth}px)`
    nodes.style['grid-auto-rows'] = `${colWidth}px`


    //////onload and onchangeOfWiwndown size
    changeNodesSize()

}
function changeNodesSize() {
    const nodes = document.querySelector('.nodes')
    const allFullNodes = nodes.children
    if (allFullNodes.length > 2) {//exclude 1 and last child
        document.querySelectorAll('.node').forEach((node) => {
            node.style.height = `${node.getBoundingClientRect().width}px`
        })
    }
}
////////////////


const addNodes = document.querySelector('.btn-addNodes')
const backdrop = document.querySelector('.backdrop')
const submitBtn = document.querySelector('.btn-submit')
const btnReverse = document.querySelector('.btn-reverse')
const btnReset = document.querySelector('.btn-reset')
const chip = document.querySelector('.chip')
const algoEl = document.querySelector('.algo')

function toggleBackdrop() {
    const backdrop = document.querySelector('.backdrop')
    backdrop.classList.toggle('hidden')
}
function toggleInputModal() {
    const modal = document.querySelector('.modal')
    modal.classList.toggle('hidden')
}
function toggleAlgo() {
    const modal = document.querySelector('.algo')
    modal.classList.toggle('hidden')
}
function getValsArray(valsStr) {
    const arr = valsStr.split(' ').map(strVal => {
        return parseFloat(strVal)
    });
    return arr.filter((val) => !Number.isNaN(val))
}
function clearInputs() {
    const nodeCount = document.getElementById('nodeCount')
    const nodeValues = document.getElementById('nodeValues')
    nodeCount.value = ''
    nodeValues.value = ''
}
btnReset.addEventListener('click', () => {
    const nodesContainer = document.querySelector('.nodes')
    const nodes = document.querySelectorAll('.full-node')
    const len = nodes.length
    for (let i = 1; i < len - 1; i++) {
        nodesContainer.removeChild(nodes[i])
    }
    enableRevButton()
})
function validate(arr, count) {
    const nodeCount = document.getElementById('nodeCount')
    const nodeValues = document.getElementById('nodeValues')
    if (arr.length != count) {
        nodeValues.style.backgroundColor = '#FFD1D1';
        nodeValues.style.borderBottom = '5px solid #f00'
        nodeCount.style.backgroundColor = '#FFD1D1';
        nodeCount.style.borderBottom = '5px solid #f00'
        return false;
    } else {
        nodeValues.style.backgroundColor = '#fff';
        nodeValues.style.borderBottom = '5px solid #fff'
        nodeCount.style.backgroundColor = '#fff';
        nodeCount.style.borderBottom = '5px solid #fff'
        return true;
    }
}
submitBtn.addEventListener('click', () => {
    const nodeCount = document.getElementById('nodeCount')
    const nodeValues = document.getElementById('nodeValues')
    const nodeValueStr = nodeValues.value
    const vals = getValsArray(nodeValueStr)
    const nodesContainer = document.querySelector('.nodes')
    const fullNodesRefs = document.querySelectorAll('.full-node')//not live
    const count = Number.parseInt(nodeCount.value);
    const oldCount = (fullNodesRefs.length - 2)
    if (!validate(vals, count)) {
        alert('Length / count / invalid number error.')
        return
    }
    //reset default color of all nodes already in nodes container
    fullNodesRefs.forEach(node => {
        if (!(nodesContainer.firstElementChild == node || nodesContainer.lastElementChild == node))
            node.firstElementChild.style.backgroundColor = '#06283d';
    })
    ///////////////
    vals.forEach(val => {
        const fullNode = `
                <div class="full-node">
                    <div class="node">
                        ${val}
                    </div>
                    <p class="link">&rarr;</p>
                </div>
        `
        nodesContainer.lastElementChild.insertAdjacentHTML('beforeBegin', fullNode)
    });
    toggleInputModal()
    toggleBackdrop()
    clearInputs()
    enableRevButton()
    changeNodesSize()
    //show toolTip
    const toolTip = document.querySelector('.toolTip')
    toolTip.classList.toggle('hidden')
    setTimeout(() => {
        toolTip.classList.toggle('hidden')
    }, 5000)
})

function disableRevButton() {
    const btnRev = document.querySelector('.btn-reverse')
    btnRev.disabled = true
    btnRev.classList.remove('hover')
}
function disableResetButton() {
    const btnReset = document.querySelector('.btn-reset')
    btnReset.disabled = true
    btnReset.classList.remove('hover')
}

function enableRevButton() {
    const btnRev = document.querySelector('.btn-reverse')
    btnRev.disabled = false
    btnRev.classList.add('hover')
}
function enableResetButton() {
    const btnReset = document.querySelector('.btn-reset')
    btnReset.disabled = false
    btnReset.classList.add('hover')
}
btnReverse.addEventListener('click', async () => {
    disableRevButton()
    disableResetButton()
    const nodesContainer = document.querySelector('.nodes')
    const fullNodesRefs = document.querySelectorAll('.full-node')//not live

    for (let i = 1; i < fullNodesRefs.length - 1; i++) {
        const curNode = fullNodesRefs[i]
        curNode.firstElementChild.style.backgroundColor = 'red';
        curNode.style.transform = 'translateY(-10px)'
        await new Promise((res, rej) => {
            setTimeout(() => {
                nodesContainer.firstElementChild.insertAdjacentElement('afterEnd', curNode)
                curNode.style.transform = 'translateY(0px)'
                res()
            }, 1000);
        })
        curNode.firstElementChild.style.backgroundColor = '#0f0';
    }
    enableResetButton()
})

addNodes.addEventListener('click', () => {
    toggleBackdrop()
    toggleInputModal()
})

backdrop.addEventListener('click', () => {
    if (!document.querySelector('.modal').classList.contains('hidden'))
        toggleInputModal()
    if (!document.querySelector('.algo').classList.contains('hidden'))
        toggleAlgo()
    toggleBackdrop()

})

chip.addEventListener('click', () => {
    toggleBackdrop()
    algoEl.classList.toggle('hidden')
})

