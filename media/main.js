window.addEventListener("DOMContentLoaded", () => {

  const vscode = acquireVsCodeApi()

  window.addEventListener('message', event => {
    const data = event.data
    switch (data.type) {
      case 'reloadLauncher' :
      {
        reloadLauncher(data)
        break
      }
    }
  })

  // Set Button Events.
  document.querySelector('.reload-button').addEventListener('click', () => clickReload())
  document.querySelector('.push-button').addEventListener('click', () => clickPush())
  document.querySelector('.pull-button').addEventListener('click', () => clickPull())
  document.querySelector('.open-button').addEventListener('click', () => clickOpen())

  // Button Action.
  const clickReload = () => vscode.postMessage({type: 'reload'})
  const clickPush = () => vscode.postMessage({type: 'push'})
  const clickPull = () => vscode.postMessage({type: 'pull'})
  const clickOpen = () => vscode.postMessage({type: 'open'})
  const clickRunMacro = (e) => {
    const id = e.currentTarget.id
    method = document.querySelector(`#method${id}`).textContent
    args = document.querySelector(`#args${id}`).textContent

    vscode.postMessage({
      type: 'runMacro',
      call: method,
      args: args,
      description: ''
    })
  }

  // run-button activate onclick.
  document.querySelectorAll('.run-button').forEach((button) => {
    button.onclick = clickRunMacro
  })

  const reloadLauncher = (data) => {
  
    document.querySelector('.macrolist-body').remove()
  
    jsonData = JSON.parse(data.jsonText)
  
    // macrolist-body
    const macrolistBody = document.createElement('div')
    macrolistBody.className = 'macrolist-body'
    document.querySelector('.macro-list').appendChild(macrolistBody)
  
    jsonData.macros.forEach((macro, index) => {
  
      // macro-card
      const macroCard = document.createElement('div')
      macroCard.className = 'macro-card'
      macroCard.id = `macro-card${index}`
      document.querySelector(`.macrolist-body`).appendChild(macroCard)
  
      // macro-header
      const macroHeader = document.createElement('div')
      macroHeader.id = `macro-header${index}`
      macroHeader.className = 'macro-header'
      document.querySelector(`#macro-card${index}`).appendChild(document.createElement('hr'))
      document.querySelector(`#macro-card${index}`).appendChild(macroHeader)
  
      // macro-header > run-button
      const runButton = document.createElement('button')
      runButton.id = `${index}`
      runButton.className = 'run-button'
      runButton.textContent = 'Run'
      runButton.onclick = clickRunMacro
      document.querySelector(`#macro-header${index}`).appendChild(runButton)
  
      // macro-header > h2
      const macroTitle = document.createElement('h2')
      macroTitle.textContent = macro.title
      document.querySelector(`#macro-header${index}`).appendChild(macroTitle)
  
      // macro-params
      const macroParams = document.createElement('div')
      macroParams.id = `macro-params${index}`
      macroParams.className = 'macro-params'
      document.querySelector(`#macro-card${index}`).appendChild(macroParams)
  
      // macro-params > macro-method
      const macroMethod = document.createElement('div')
      macroMethod.id = `macro-method${index}`
      macroMethod.className = 'macro-method'
      document.querySelector(`#macro-params${index}`).appendChild(macroMethod)
  
      const methodLabel = document.createElement('div')
      methodLabel.className = 'label'
      methodLabel.textContent = 'Method : '
      document.querySelector(`#macro-method${index}`).appendChild(methodLabel)
  
      const methodText = document.createElement('h3')
      methodText.id = `method${index}`
      methodText.textContent = macro.call
      document.querySelector(`#macro-method${index}`).appendChild(methodText)
  
      // macro-params > macro-args
      const macroArgs = document.createElement('div')
      macroArgs.id = `macro-args${index}`
      macroArgs.className = `macro-args`
      document.querySelector(`#macro-params${index}`).appendChild(macroArgs)
  
      const argsLabel = document.createElement('div')
      argsLabel.className = 'label'
      argsLabel.textContent = 'Args : '
      document.querySelector(`#macro-args${index}`).appendChild(argsLabel)
  
      const argsText = document.createElement('h3')
      argsText.id = `args${index}`
  
      let fixArgs = ''
      if (macro.args.length > 0) {
        const stringArgFix = macro.args.map((arg) => {
          if (typeof arg === 'string') {
            return `"${arg}"`
          } else {
            return arg
          }
        })
        fixArgs = stringArgFix.join(', ')
      }
  
      argsText.textContent = fixArgs
      document.querySelector(`#macro-args${index}`).appendChild(argsText)
  
      // macro-desc
      const macroDesc = document.createElement('div')
      macroDesc.className = 'macro-desc'
      macroDesc.textContent = macro.description
      document.querySelector(`#macro-card${index}`).appendChild(macroDesc)
    })
  }
})