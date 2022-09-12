import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Pagination, PaginationItem } from '@material-ui/lab'
import { getPosts } from '../actions/posts'
import useStyles from './styles'

const Paginate = ({ page }) => {
  const { numberOfPages, posts, currentPage } = useSelector(
    (state) => state.posts
  )
  const classes = useStyles()
  const dispatch = useDispatch()

  useEffect(() => {
    if (page) dispatch(getPosts(page))
  }, [page, dispatch])

  console.log(currentPage)

  return (
    <Pagination
      classes={{ ul: classes.ul }}
      count={numberOfPages}
      page={Number(page)}
      variant='outlined'
      color='primary'
      renderItem={(item) => (
        <PaginationItem
          {...item}
          component={Link}
          to={`/posts?page=${item.page}`}
        />
      )}
    />
  )
}

export default Paginate
