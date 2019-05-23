import React from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';

class App extends React.Component {
  state = {
    amount: '',
    result: [],
    error: ''
  }

  handleChange = (e) => {
    this.setState({
      amount: e.target.value,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const unformatted = this.state.amount;
    let money = unformatted.replace(/[A-Z a-z]|[^\s+]*\s+|\./g, '').replace(/,([^,]).$/g, '.');
    console.log(money);

    if (isNaN(parseFloat(unformatted[unformatted.length -1])) && !isNaN(parseFloat(money))) {
      this.setState({
        ...this.state,
        error: 'Valid character in wrong position',
        result: []
      });
    } else {

      if (money.includes(',') || money.includes(' ')) {
        this.setState({
          ...this.state,
          error: 'Invalid separator!',
          result: []
        });

      } else {
        if (!isNaN(money)) {
          
          money = parseFloat(money);
          const amounts = this.props.amounts;
          const result = amounts.map(v => {
            if (money % v < money) {
              const nominal = { amount: v, qty: Math.floor(money / v)};
              money = money % v;
              return nominal;
            } else {
              return null
            }
          })
          this.setState({
            ...this.state,
            error: '',
            result: result
          });
        } else {
          this.setState({
            ...this.state,
            error: 'Missing value!',
            result: []
          });
    
        }
      }
    }
  }

  render() {
    const { result, error } = this.state;
    return (
      <div className="container mt-3">
        <div className="col-md-12">
          <h1>Find amount</h1>
          <div className="form-group">
            <label className="control-label">Enter amount</label>
            <form onSubmit={this.handleSubmit}>
              <div className="input-group mb-3">
                <input type="text" className="form-control input-lg text-right" onChange={this.handleChange} />
                <div className="input-group-prepend">
                  <button className="btn btn-secondary" type="submit">Submit</button>
                </div>
              </div>
                { error && (
                  <span className="help-block text-danger">{error}</span>
                ) }
            </form>
          </div>
          <p>Result:</p>
          { result &&
            (

            <table className="table table-bordered">
              <tbody>
                {
                  result.map((r, i) => {
                      return r && (
                      <tr key={i}>
                          <td><NumberFormat value={r.amount} displayType={'text'} decimalSeparator={','} thousandSeparator={'.'} prefix={'Rp'} renderText={value => <span>{value}</span>} /> (x{r.qty})</td>
                        </tr> 
                      )
                  })
                }
              </tbody>
            </table>
            )
           }
        </div>
      </div>
    )
  }
}

App.protoTypes = {
  amounts: PropTypes.array
}

App.defaultProps = {
  amounts: [
    100000,
    50000,
    20000,
    10000,
    5000,
    1000,
    500,
    100,
    50,
  ]
}

export default App;
