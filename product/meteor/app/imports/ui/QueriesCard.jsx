import React           from 'react'

import Container       from '@material-ui/core/Container'
import Paper           from '@material-ui/core/Paper'
import Grid            from '@material-ui/core/Grid'
import Box             from '@material-ui/core/Box'

import QuizBox         from './QuizBox'

import { makeStyles  } from '@material-ui/core/styles'
import { primary,
         secondary   } from './Themes'

const styles = makeStyles(theme => (
{
  container :
  {
    display  : 'flex',
    flexWrap : 'wrap',
  },
  textField :
  {
    marginLeft  : theme.spacing(1),
    marginRight : theme.spacing(1),
  },
  dense :
  {
    marginTop : theme.spacing(2),
  },
  menu :
  {
    width : 200,
  },
}))

const css =
{
  root :
  {
    padding    : 0,
//  marginTop  : 8,
    background : 'transparent',
  },

  box :
  {
    marginTop   : 8,
  }
}

export default class QueriesCard extends React.Component
{
  render = () =>
  {
    console.log(`client > Queries > render`)

    return (
      <Container id="QueriesRoot" style={css.root}>
        <QuizBox style={css.box}
                 context={this.props.context}
                 terms={this.state.terms}
                 knobs={this.state.knobs}
                 color={this.state.color}
                 onTypeText={this.onTypeText}
                 onClickAsk={this.onClickAsk}
                 onClickSub={this.onClickSub} />
      </Container>
    )
  }

  constructor (props)
  {
    super(props)

    this.queryIndex = this.queryIndex.bind(this)
    this.onClickAsk = this.onClickAsk.bind(this)
    this.onClickSub = this.onClickSub.bind(this)

    this.ready = true
    this.state = 
    {
      place : 'Activity Search Terms',
      terms : '',
      knobs :
      {
          subtitles : false,
          all_terms : true
      },
      color : 'default'
    }
  }

  queryIndex = () =>
  {
    if (!this.ready)
    {
      console.log(`client > Queries > queryIndex : Not Ready`)
    }
    else
    {
      this.ready = false

      var terms = this.state.terms
      var knobs = this.state.knobs

      console.log(`client > Queries > queryIndex : callin api_queryIndex : KNOBS = ${JSON.stringify(knobs, null, 2)}`)
  
      Session.set('FIRST', false)
      Session.set('TABLE',  null)
      Session.set('ERROR', false)

      Meteor.call('api_queryIndex', { terms : terms, knobs : knobs }, (err, res) =>
      {
        console.log('client > Queries > queryIndex : return api_queryIndex')

        if (err)
        {
            console.log(`ERR => ${err}`)
            Session.set('ERROR', true)
        }

        if (res)
        {
            console.log(`RES => ${JSON.stringify(res, null, 4)}`)
            Session.set('TABLE', res.result)
        }

        this.ready = true
      })
    }
  }

  onClickAsk = (e) =>
  {
    console.log(`client > Queries > onClickAsk`)

    this.queryIndex()
  }

  onClickSub = (e) =>
  {
    console.log(`client > Queries > onClickSub : KNOBS = ${JSON.stringify(this.state.knobs, null, 2)}`)

    this.setState({ knobs : { ...this.state.knobs, subtitles : !this.state.knobs.subtitles } })
    this.setState({ color : this.state.color == 'secondary' ? 'default' : 'secondary' })
  }

  onTypeText = (e) =>
  {
    console.log(`client > Queries > onTypeText`)

    this.setState({ terms : e.target.value })
  }
}
