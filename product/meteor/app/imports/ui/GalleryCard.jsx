import { withTracker } from 'meteor/react-meteor-data'

import React           from 'react'
import YouTube         from 'react-youtube'

import Paper           from '@material-ui/core/Paper'
import Grid            from '@material-ui/core/Grid'
import GridList        from '@material-ui/core/GridList'
import GridListTile    from '@material-ui/core/GridListTile'
import GridListTileBar from '@material-ui/core/GridListTileBar'
import IconButton      from '@material-ui/core/IconButton'
import StarBorderIcon  from '@material-ui/icons/StarBorder'

import { makeStyles }  from '@material-ui/core/styles'

const css =
{
  top :
  {
    width      : '100%',
    marginTop  : 8,
    overflowX  : 'auto',
    background : 'black'
  },

  root :
  {
    display        : 'flex',
    flexWrap       : 'wrap',
    justifyContent : 'space-around',
    overflow       : 'hidden',
    background     : 'transparent'
  },

  list :
  {
    flexWrap   : 'nowrap',
    transform  : 'translateZ(0)',
    background : 'transparent'
  },

  title :
  {
    color : 'white',
  },

  icon :
  {
    color : 'white'
  },

  tube :
  {
    border : 0
  }
}

class GalleryPart extends React.Component
{
  constructor(props)
  {
    super(props)
  }

  getYTLink = (hit) =>
  {
    console.log(hit)

    //https://www.npmjs.com/package/react-youtube

    var auto = hit.rank == 1 ? 1 : 0
    var link = `https://www.youtube.com/embed/${hit.video}`
    var trim = `start=${hit.start}&end=${hit.end}`
    var opts = `enablejsapi=1&origin=http://actiq.biz&rel=0&modestbranding=1&autohide=1&showinfo=0&controls=0&playsinline=1&iv_load_policy=3&autoplay=${auto}`
    var more = `cc_load_policy=1`

    return `${link}?${trim}&${opts}&${more}`
  }

  render = () =>
  {
    const table = this.props.table
    const first = this.props.first
    const error = this.props.error

    console.log(`client > Gallery > render : TABLE = ${JSON.stringify(table)}`)

    if (table && table.clips)
    {
      return (
        <Paper style={css.top}>
          <Grid style={css.root}>
            <GridList style={css.list} cols={2.5}>
              {table.clips.map(hit => (
                <GridListTile key={hit.rank} style={{width:640, height:360, padding:0}}>
                  <iframe style={css.tube} type='text/html' width='640' height='360' allow='autoplay' frameBorder='0' src={this.getYTLink(hit)}></iframe>
                  <GridListTileBar style={css.title} titlePosition='bottom' title={`${hit.rank} - Starting at ${hit.start} Second(s)`} subtitle={hit.match} actionIcon={<IconButton style={css.icon}><StarBorderIcon/></IconButton>} />
                </GridListTile>
              ))}
            </GridList>
          </Grid>
        </Paper>
      )
    }
    else
    {
      if (first)
      {
        return (
          <Paper style={css.roo}>
          </Paper>
        )
      }
      else if (error)
      {
        return (
            <Paper style={css.roo}>
            </Paper>
          )          
      }
      else
      {
        return (
          <Paper style={css.roo}>
          </Paper>
        )
      }
    }
  }
}

export default GalleryCard = withTracker(() =>
{
  let table = Session.get('TABLE')
  let first = Session.get('FIRST')
  let error = Session.get('ERROR')
  
//console.log(`client > Gallery > trackr : TABLE = ${table}, FIRST = ${first}, ERROR = ${error}`)

  return { table : table, first : first, error : error }
})(GalleryPart)
