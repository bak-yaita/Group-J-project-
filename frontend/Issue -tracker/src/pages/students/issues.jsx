import React from 'react'
import Wrapper from '../../components/wrapper'
import Cards from '../../components/cards'

const Issues = () => {
  return (
    <Wrapper>
        <div className='mt-4 mb-4 flex flex-col gap-2 md:flex-row flexgap-4 md:justify-between'>
                <Cards
                title="Total Issues"
                number= "12"
                />
                <Cards
                title="Total Issues"
                number= "12"
                />
                <Cards
                title="Total Issues"
                number= "12"
                />
       
      </div>

    </Wrapper>
    
  )
}

export default Issues
