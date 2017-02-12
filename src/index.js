import React from 'react'
import Payment from 'payment'
import { render } from 'react-dom'

const COLORS = {
  primary: '#394452',
  secondary: '#343D4B',
  tertiary: '#272D36',
  grey: '#C5C7CB',
  green: '#82D14C'
}
const styles = {
  inputs: {
    height: '3rem'
  },
  header: {
    fontSize: '1.875rem'
  },
  subheader: {
    fontSize: '0.875rem',
    color: COLORS.grey
  },
  container: {
    backgroundColor: COLORS.primary
  },
  article: {
    backgroundColor: COLORS.secondary,
    maxWidth: '40.125rem',
    fontFamily: "Gotham, 'avenir next', avenir, helvetica"
  },
  content: {
    padding: '3rem 4rem'
  }
}

const DEPOSIT_AMOUNTS = [
  5, 10, 20, 40, 100, 250, 1000
]

class DepositAmounts extends React.Component {
  render() {
    const {
      amounts,
      current,
      updateAmount,
      valid
    } = this.props
    const amountNodes = amounts.map((amount, ix) => {
      let amountNodeStyles = {
        backgroundColor: COLORS.tertiary,
        height: styles.inputs.height,
        color: COLORS.grey,
        minWidth: styles.inputs.height,
        fontSize: '1.125rem',
        paddingLeft: '0.875rem',
        paddingRight: '0.875rem'
      }
      if (amount === current) {
        amountNodeStyles.backgroundColor = COLORS.green
        amountNodeStyles.color = 'white'
      }
      return (
        <div key={ix}
          className="fl pointer"
          onClick={() => updateAmount({ amount })}>
          <div style={amountNodeStyles} className="flex f6 pa2 fw5 br2 lh-copy center mv1 fl white items-center justify-center">
            {`$${amount}`}
          </div>
        </div>
      )
    })

    return (
      <div className="">
        <div className="items-center flex flex-wrap justify-between">{amountNodes}</div>
        <InvalidAccent valid={valid} />
      </div>
    )
  }
}

class InvalidAccent extends React.Component {
  render() {
    const { valid } = this.props
    let accentClasses = valid ? 'transparent' : 'bg-red'
    return <div className={accentClasses} style={{height: '0.125rem'}}></div>
  }
}

class SubmissionButton extends React.Component {
  render() {
    const {
      buttonState,
      submitFn
    } = this.props
    let bgColor = COLORS.green
    let disabled = false
    let content = 'Deposit Funds'
    let className = 'fw5 w-100 pointer'

    if (buttonState) {
      disabled = true
      className += ` ${buttonState}`
      if (buttonState === 'loading') {
        content = 'Loading...'
        bgColor = 'blue'
      } else if (buttonState === 'success') {
        content = 'SUBMITTED!'
        bgColor = 'orange'
      } else if (buttonState === 'error') {
        content = 'ERROR!'
        bgColor = 'red'
      }
    }

    const props = {
      className,
      disabled,
      style: {
        border: 'none',
        color: 'white',
        fontFamily: 'Gotham',
        fontWeight: 600,
        height: styles.inputs.height,
        backgroundColor: bgColor
      },
      onClick: submitFn
    }

    return (
      <button {...props}>{content}</button>
    )
  }
}

class Input extends React.Component {
  render () {
    const {
      stateKey,
      classes,
      placeholder,
      pattern,
      label,
      type,
      max,
      inputMode,
      value,
      validations,
      focused,
      focus,
      blur,
      validateFn,
      styles: customStyles
    } = this.props

    let borderStyles = {}
    if (focused === stateKey) {
      borderStyles.border = `0.0625rem ${COLORS.green} solid`
    }
    const inputStyles = Object.assign(
      {
        backgroundColor: COLORS.tertiary,
        border: 'none',
        height: styles.inputs.height,
        fontFamily: 'Gotham'
      },
      customStyles,
      borderStyles
    )
    const containerClass = 'fl';
    const inputClasses = [
      'br2 f5 fw5 white',
      classes
    ].join(' ')

    return (
      <div className="flex flex-column w-100">
        <input
          className={inputClasses}
          style={inputStyles}
          key={stateKey}
          name={stateKey}
          id={stateKey}
          type={type}
          value={value}
          min={0}
          pattern={pattern}
          inputMode={inputMode}
          placeholder={placeholder}
          onFocus={focus}
          onBlur={blur}
          onChange={validateFn(stateKey, max)} />
        <InvalidAccent valid={validations[stateKey]} />
      </div>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)

    this.validateInputForName = this.validateInputForName.bind(this)
    this.focus = this.focus.bind(this)
    this.blur = this.blur.bind(this)
    this.validateCharge = this.validateCharge.bind(this)
    this.actionCallback = this.actionCallback.bind(this)

    this.state = {
      focused: null,
      amount: null,
      number: null,
      name: null,
      expiry: null,
      cvc: null,
      buttonState: null,
      validations: {
        amount: true,
        number: true,
        expiry: true,
        cvc: true,
        name: true
      }
    }
  }

  cardForm () {
    const {
      validations,
      number,
      expiry,
      cvc,
      name,
      buttonState
    } = this.state

    const inputs = {
      number: {
        stateKey: 'number',
        placeholder: 'Credit card number',
        pattern: "[0-9]*",
        type: "number",
        classes: "w-100 pl2 fw6",
        label: 'Card Number',
        max: 16,
        value: number
      },
      name: {
        stateKey: 'name',
        placeholder: 'Name on card',
        pattern: "[a-z]*",
        type: "text",
        classes: "w-100 pl2 fw6",
        styles: {},
        label: 'Card Number',
        value: name
      },
      expiry: {
        stateKey: 'expiry',
        placeholder: 'MM/YY',
        pattern: "[0-9]*",
        type: "number",
        classes: "pl2 tc-ns fw6",
        label: 'Card Expiry',
        max: 4,
        value: expiry
      },
      cvc: {
        stateKey: 'cvc',
        placeholder: 'CVC',
        pattern: "[0-9]*",
        type: "number",
        classes: "pl2 tc-ns fw6",
        max: 4,
        label: 'CVC',
        value: cvc
      }
    }

    const inputsMargins = { marginTop: '0.825rem', marginBottom: '0.825rem' }
    const inputTopMargin = { marginTop: '0.825rem' }
    const inputLeftMargin = { marginLeft: '0.825rem' }
    const baseProps = {
      focus: this.focus,
      blur: this.blur,
      validations,
      validateFn: this.validateInputForName
    }

    const submissionProps = {
      buttonState,
      submitFn: this.validateCharge
    }

    return (
      <div className='flex flex-column w-100 overflow-hidden' style={{marginTop: '1rem'}}>
        <div className="flex w-100">
          <Input {...Object.assign({}, baseProps, inputs.number)} />
        </div>
        {/* Small Inputs */}
        <div className="flex flex-column dn-ns w-100" style={inputsMargins}>
          <div className="flex">
            <Input {...Object.assign({}, baseProps, inputs.name)} />
          </div>
          <div className="flex" style={inputTopMargin}>
            <Input {...Object.assign({}, baseProps, inputs.expiry)} />
          </div>
          <div className="flex" style={inputTopMargin}>
            <Input {...Object.assign({}, baseProps, inputs.cvc)} />
          </div>
        </div>
        {/* Not Small Inputs */}
        <div className="dn flex-ns w-100" style={inputsMargins}>
          <div className="flex-auto w-100">
            <Input {...Object.assign({}, baseProps, inputs.name)} />
          </div>
          <div className="flex tc" style={inputLeftMargin}>
            <Input {...Object.assign({}, baseProps, inputs.expiry, {styles: { width: '5.25rem' }})} />
          </div>
          <div className="flex tc" style={inputLeftMargin}>
            <Input {...Object.assign({}, baseProps, inputs.cvc, {styles: { width: '4rem' }})} />
          </div>
        </div>
        <div className="flex w-100">
          <SubmissionButton {...submissionProps} />
        </div>
      </div>
    )
  }

  validateInputForName(stateKey, max) {
    return (e) => {
      let { value } = e.target
      const inputLength = `${value}`.length
      if (inputLength > max) return

      const updatedState = {}
      if (stateKey === 'name') {
        const matches = value.match(/([a-zA-Z ]+)/g)
        value = matches ? matches[0] : ''
      }

      updatedState[stateKey] = value
      this.setState(updatedState)
    }
  }

  deconstructExpiry () {
    const { expiry } = this.state
    let expiryData = {
      month: '',
      year: ''
    }
    if (expiry) {
      expiryData.month = expiry.slice(0, 2)
      expiryData.year = expiry.slice(2)
    }

    return expiryData
  }

  creditCardParams () {
    let expiry = this.deconstructExpiry()

    return {
      number: this.state.number,
      cvc: this.state.cvc,
      exp_month: expiry.month,
      exp_year: expiry.year
    }
  }

  validateCharge () {
    this.setState({
      buttonState: 'loading'
    }, () => {
      const {
        amount,
        number: formNumber,
        name: formName,
        cvc: formCvc
      } = this.state
      const name = formName && formName.length > 0
      const number = Payment.fns.validateCardNumber(formNumber)
      const expiryData = this.deconstructExpiry()
      const expiry = Payment.fns.validateCardExpiry(expiryData.month, expiryData.year)
      const cvc = Payment.fns.validateCardCVC(formCvc)
      const validations = {
        amount,
        name,
        number,
        expiry,
        cvc
      }

      if (amount && name && number && expiry && cvc) {
        this.setState({ validations }, () => {
          let ccParams = this.creditCardParams()
          this.actionCallback()
        })
      } else {
        this.setState({ validations }, () => {
          this.actionCallback(true)
        })
      }
    })
  }

  actionCallback (err) {
    const buttonState = err ? 'error' : 'success'

    this.setState({
      buttonState
    }, () => {
      setTimeout(() => {
        this.setState({ buttonState: null })
      }, 1000)
    })
  }


  focus (e) {
    this.setState({ focused: e.target.name })
  }

  blur (e) {
    if (this.state.focused === e.target.name) {
      this.setState({ focused: null })
    }
  }

  accentBar() {
    return <div className="w-100 br--top br2" style={{backgroundColor: COLORS.green, height: '0.5rem' }} />
  }

  header() {
    return (
      <div className="tc">
        <div className="f3 white fw7 mv2" style={styles.header}>DEPOSIT FUNDS</div>
        <div className="f6 white" style={styles.subheader}>$2,100,312 won in the last 24 hours</div>
      </div>
    )
  }

  render () {
    const {
      amount,
      validations
    } = this.state
    return (
      <div className="container w-100 h-100 flex items-center" style={styles.container}>
        <article className="w-90 w-66-ns center br2" style={styles.article}>
          {this.accentBar()}
          <div style={styles.content}>
            {this.header()}
            <div className="tc mt4">
              <DepositAmounts amounts={DEPOSIT_AMOUNTS}
                        updateAmount={this.setState.bind(this)}
                               valid={validations.amount}
                              current={amount} />
              {this.cardForm()}
            </div>
          </div>
        </article>
      </div>
    )
  }
}

render(<App/>, document.getElementById('main'))
