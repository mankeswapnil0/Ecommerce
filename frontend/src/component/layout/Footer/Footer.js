import React from 'react'
import playstore from '../../../images/playstore.png'
import appstore from '../../../images/appstore.png'
import './Footer.css'

function Footer() {
    return (
        <footer id='footer'>
            <div className='leftfooter'>
                <h4>DOWNLOAD OUR APP</h4>
                <p>Download App for Android and Ios</p>
                <img src={playstore} alt='playstore' />
                <img src={appstore} alt='appstore' />
            </div>

            <div className='midfooter'>
                <h1>ECOMMERCE</h1>
                <p>High Quality is our first priority</p>
                <p>Copyrights 2022 &copy;</p>
            </div>

            <div className='rightfooter'>
                <h4>Follow Us</h4>
                <a href='http://linkedin.com'>LinkedIn</a>
                <a href='http://instagram.com'>Instagram</a>
                <a href='http://facebook.com'>Facebook</a>
            </div>
        </footer>
    )
}

export default Footer
