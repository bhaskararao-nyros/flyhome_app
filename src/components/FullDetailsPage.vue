<template>
<div class="full_details_page">
	<div class="head_component">
		<HeaderComponent ref="headerComp" />
	</div>
	  	<div class="full_details_div">
	  		<b-carousel id="carousel1"
              style="text-shadow: 1px 1px 2px #333;"
              controls
              indicators
              background="#ababab"
              :interval="4000"
          	>

	            <!-- Text slides with image -->
	            <b-carousel-slide v-for="(image, index) in host_images" :key="index">
	              <img slot="img" class="w-100" width="1024" height="600"
	             :src="image.url" alt="image slot">
	            </b-carousel-slide>

          	</b-carousel>
          	<b-button variant="default" class="book_now_btn" @click="show_booking_modal=true">Book Now</b-button>
          	<div class="owner_details_blk">
          		<h3 class="host_name">{{ host.name }} -  <span><img :src="host.owner.profile_pic" width="40px" height="40px"> <small>{{ host.owner.firstname }} {{ host.owner.lastname }} </small></span></h3>
          	</div>
          	
          	<b-row>
		        <b-col class="details_blk">
		        	<ul class="details_ul">
		        		<li>
		        			<p class="sleeping_head">Sleeping arrangements</p>
		        			<span v-for="(bedrm, index) in host.bed_rooms">
		        				<span>Bed Rooms {{ index + 1 }}</span> - 
		        				<span>{{ bedrm.sofa + bedrm.single + bedrm.double + bedrm.queen }} beds</span>
		        				<br>
		        			</span>
		        		</li>
		        		<li> 
		        		<p class="sleeping_head">Guests allowed</p>
		        			<span v-for="bed in host.guests">
		        				<img class="bed_img" src="../assets/img/guest.jpg">
		        			</span>
		        		</li>
		        		<li>
		        			<p class="sleeping_head">Host Type</p>
		        			<span>
		        			{{ host.host_type }} &nbsp;&nbsp;
		        				<img v-if="host.host_type === 'Shared Room'" class="bed_img" src="../assets/img/shared.png">
		        				<img v-if="host.host_type === 'Private Room'" class="bed_img" src="../assets/img/single.png">
		        				<img v-if="host.host_type === 'Entire Place'" class="bed_img" src="../assets/img/house.png">
		        			</span>
		        		</li>
		        		<li> <p class="sleeping_head">Price</p><span class="price_tag">&#x20B9; {{ host.price }}</span></li>
		        		<li> <p class="sleeping_head">Amentities</p>
	        				<span v-for="(bathrm, index) in host.bath_rooms">
		        				<span>Bath Rooms {{ index + 1 }}</span> - 
		        				<span>{{ bathrm.shared ? "Shared bathroom" : "Private bathroom" }}</span><br>
		        			</span>
		        			<p class="m-b-none" v-if="host.amentities.wifi">Wi-fi</p>
		        			<p class="m-b-none" v-if="host.amentities.tv">Tv</p>
		        			<p class="m-b-none" v-if="host.amentities.ac">Ac</p>
		        			<p class="m-b-none" v-if="host.amentities.hair_dryer">Hair Dryer</p>
		        			<p class="m-b-none" v-if="host.amentities.pets">Pets</p>
		        			<p class="m-b-none" v-if="host.amentities.Iron">Iron</p>

		        		</li>
		        		<li><p class="sleeping_head">Safety Amentities</p>
		        			<p class="m-b-none" v-if="host.safety_amentities.fire_safety">Fire Safety</p>
		        			<p class="m-b-none" v-if="host.safety_amentities.first_aid_kit">First Aid Kit</p>
		        		</li>
		        		<li><p class="sleeping_head">Allowed Spaces</p>
		        			<p class="m-b-none" v-if="host.allowed_spaces.pvt_living_room">Private living room</p>
		        			<p class="m-b-none" v-if="host.allowed_spaces.pool">Pool</p>
		        			<p class="m-b-none" v-if="host.allowed_spaces.kitchen">Kitchen</p>
		        			<p class="m-b-none" v-if="host.allowed_spaces.gym">Gym</p>
		        			<p class="m-b-none" v-if="host.allowed_spaces.laundry_washer">Laundry Washer</p>
		        			<p class="m-b-none" v-if="host.allowed_spaces.laundry_dryer">Laundry Dryer</p>
		        			<p class="m-b-none" v-if="host.allowed_spaces.hot_tub">Hot Tub</p>
		        		</li>
		        		<li><p class="sleeping_head">Rules</p>
		        			<p class="m-b-none">{{ host.rules.smoking ? "No smoking" : '' }}</p>
		        			<p class="m-b-none">{{ host.rules.events ? "No events" : '' }}</p>
		        			<p class="m-b-none">{{ host.rules.parties ? "No parties" : '' }}</p>
		        		</li>
		        		<li>
		        			<p class="sleeping_head">Location</p>
		        		 	{{ host.location }}
		        		</li>
		        	</ul>
		        </b-col>
		        <b-col class="map_blk">
		        	<GmapMap
					  :center="map_coordinates"
					  :zoom="15"
					  map-type-id="terrain"
					  style="width: 100%; height: 650px"
					>
					  <GmapMarker
					    :position="map_coordinates"
					    :clickable="true"
					    :draggable="true"
					    @click="center=map_coordinates"
					  />
					</GmapMap>
					<b-btn v-if="user_loggedin" @click="openModal" size="sm" variant="primary">Give us Feedback</b-btn>

					<b-modal ref="myModalRef" hide-footer title="Feedback">
					    <div v-if="!rating_submitted">
					      <div class="d-block">
					        <p class="review_rating_p">Give your rating: </p>
					       	<StarRating :rating="host_rating" @rating-selected ="setRating" :increment="increment"></StarRating>
					       	<div class="red-color" v-if="rating_err">Please select rating more than 0</div>
					       	<p class="review_rating_p">Write your review: </p>
					       	<b-form-textarea id="textarea1"
			                    v-model="review_txt"
			                    placeholder="Write your review here"
			                    rows="3"
			                    max-rows="6">
	    					</b-form-textarea>
					       	<div class="red-color" v-if="review_err">Review shouldn't be empty</div>
					      </div>
					      <div class="text-center">
					      	<b-btn class="mt-3" size="sm" variant="secondary" @click="hideModal">Cancel</b-btn>
					      	<b-btn class="mt-3" size="sm" variant="primary" @click="submitRating">Submit</b-btn>
					      </div>
					    </div>
					    <div v-if="rating_submitted" class="text-center">
					    	<h3><b>Thank you for your feedback</b></h3>
					    	<b-btn class="mt-3" size="sm" block variant="outline-secondary" @click="hideModal">Close</b-btn>
					    </div>
				    </b-modal>
		        </b-col>
		    </b-row>
		    <b-tabs pills card>
			    <b-tab title="Reviews and Ratings" active>
			      <div class="review_blk" v-if="host.review_rating.length > 0" v-for="rating in host.review_rating" :key="rating._id">
			      	<b-row>
			      		<b-col cols="2">
			      			<img :src="rating.user_id.profile_pic" width="100px" height="100px" class="img-circle">
			      		</b-col>
			      		<b-col>
			      			<span class="quoted_user">{{ rating.user_id.firstname }}</span><br>
			      			<span class="quotes">&#10077;</span> {{ rating.review }} <span class="quotes">&#10078;</span><br>
			      			<span><StarRating star-size="25" :rating="rating.rating" show-rating="false" read-only="true"></StarRating></span>
			      		</b-col>
			      	</b-row>
			      </div>
			      <div v-if="host.review_rating.length === 0">
			      	<p class="text-center">No reviews and ratings yet</p>
			      </div>
			    </b-tab>
			</b-tabs>
	  	</div>
	  	<FooterComponent />

	  	<b-modal id="booking_modal" v-model="show_booking_modal"
             title="Booking"
             header-bg-variant="primary"
             header-text-variant="dark"
             body-bg-variant="light"
             body-text-variant="dark"
             footer-bg-variant="light"
             footer-text-variant="dark">
	       <b-container fluid>
	         <div class="booking_details" v-if="show_booking_details">
	         	<div class="listing_details">
	         		<b-row>
	         			<b-col>
	         				<p>{{ host.name }}</p>
	         			</b-col>
	         			<b-col class="values">
	         				<img :src="host.images[0].url" width="100px" height="60px">
	         			</b-col>
	         		</b-row>
	         	</div>
	           	<div class="guests_blk">
	           		<b-row>
	         			<b-col>
	         				<label>Number of guests to stay</label>
	         			</b-col>
	         			<b-col class="values">
	         				<b-button variant="primary" :disabled="decre_btn_disabled" @click="decreGuests" class="beds_decre_btn">-</b-button> {{ guests_count }}
	           				<b-button variant="primary" :disabled="incre_btn_disabled" @click="increGuests" class="beds_incre_btn">+</b-button>
	         			</b-col>
	         		</b-row>
	           	</div>
	           	<div class="check_inout_blk">
	           		<b-row>
	         			<b-col>
	         				<label>Check in & out</label>
	         			</b-col>
	         			<b-col class="values">
	         				<date-picker lang="en" v-model="checkin_out_date" range placeholder="Check in & Check out" @change="onChangeCheckInOut"></date-picker>
	         			</b-col>
	         		</b-row>
	           	</div>
	           	<div class="taxes_div" v-if="total_price_cal_blk">
	           		<b-row>
	           			<b-col>
	           				<span>&#x20B9;{{ total_guests_amount.toLocaleString() }} &#x2613; {{ day_nights }} nights</span>
	           			</b-col>
	           			<b-col class="values">
	           				<span>&#x20B9; {{ (total_guests_amount * day_nights).toLocaleString() }}</span>
	           			</b-col>
	           		</b-row>
	           		<b-row>
	           			<b-col>
	           				<span>Cleaning fee</span>
	           			</b-col>
	           			<b-col class="values">
	           				<span>&#x20B9; {{ cleaning_fee.toLocaleString() }}</span>
	           			</b-col>
	           		</b-row>
	           		<b-row>
	           			<b-col>
	           				<span>Service fee</span>
	           			</b-col>
	           			<b-col class="values">
	           				<span>&#x20B9; {{ service_fee.toLocaleString() }}</span>
	           			</b-col>
	           		</b-row>
	           		<b-row class="total_row">
	           			<b-col>
	           				<span>Total</span>
	           			</b-col>
	           			<b-col class="values">
	           				<span>&#x20B9; {{ (total_amount + service_fee + cleaning_fee).toLocaleString() }}</span>
	           			</b-col>
	           		</b-row>
	           	</div>
	         </div>
	         <div v-if="!show_booking_details">
	         	<PayPal
	         	  env="sandbox"
				  amount="0.01"
				  currency="USD"
				  locale="en_US"
				  :client="paypal_credentials"
				  @payment-authorized="onPaymentAuthorized"
		          @payment-completed="onPaymentSuccess"
		          @payment-cancelled="onPaymentFail">
				</PayPal>
	         </div>
	       </b-container>
	       <div slot="modal-footer" class="w-100 booking_modal_footer">
	       	 <b-btn size="sm" class="float-right" variant="primary" @click="onBooking">
	           Book
	         </b-btn>
	         <b-btn size="sm" class="float-right" variant="default" @click="show_booking_modal=false">
	           Close
	         </b-btn>
	       </div>
	    </b-modal>
  	</div>
</template>

<script>

import HeaderComponent from '@/components/Header'
import FooterComponent from '@/components/Footer'
import StarRating from 'vue-star-rating'
import DatePicker from 'vue2-datepicker'
import AppService from '@/services/AppService'
import PayPal from 'vue-paypal-checkout'

export default {
  name: 'FullDetailsPage',
  data () {
    return {
    	show_booking_details: true,
    	total_amount:0,
    	total_guests_amount:0,
    	total_price_cal_blk: false,
    	cleaning_fee:0,
    	service_fee:0,
    	day_nights:0,
    	checkin_out_date:[],
    	incre_btn_disabled: false,
    	decre_btn_disabled: true,
    	guests_count: 1,
    	show_booking_modal: false,
    	host:[],
    	host_images:[],
    	map_coordinates:{},
    	markers:[{ lat:'16.9754085', lng:'82.23523969999997' }],
    	review_txt:'',
    	host_rating:0,
    	increment:0.5,
    	rating_err: false,
    	review_err: false,
    	user_loggedin: false,
    	rating_submitted: false,
    	paypal_credentials: { 
    		sandbox: 'AWk7NIWfNQpUMRfp52qde_xkuZDyez86IR0oBGYR1fesv0TlLVq4tbuat4VJALP26coplpQ7l4c6mCMe',
    		production: '' }
    }
  },
  methods: {
  	openModal () {
  		this.$refs.myModalRef.show()
  	},
  	hideModal () {
  		this.$refs.myModalRef.hide()
  	},
  	submitRating () {
  		if (this.host_rating === 0) {
  			this.rating_err = true
  		} else {
  			this.rating_err = false
  		}
  		if (this.review_txt === "") {
  			this.review_err = true
  		} else {
  			this.review_err = false
  		}

  		if (this.host_rating !== 0 && this.review_txt !== "") {
  			let user = JSON.parse(localStorage.getItem('user'))
  			let data = { review: this.review_txt, rating: this.host_rating, user_id: user._id, host_id: this.$route.params.id }
  			AppService.saveRatingReview(data).then(res => {
		      console.log('user rating review', res.data.data)
		      if (res.data.status === "success") {
		      	this.rating_submitted = true
		      }
		    })
  		}
  	},
  	setRating (rating) {
  		this.host_rating = rating
  	},
  	increGuests () {
  		if (this.host.guests > this.guests_count) {
  			this.guests_count += 1
  			if (this.guests_count > 1) {
  				this.decre_btn_disabled = false
  			}
  		} else {
  			this.incre_btn_disabled = true
  		}

  		this.onChangeCheckInOut()
  	},
  	decreGuests () {
  		if (this.guests_count > 1) {
  			this.guests_count -= 1
  			if (this.guests_count < this.host.guests) {
  				this.incre_btn_disabled = false
  			}
  		} else {
  			this.decre_btn_disabled = true
  		}

  		this.onChangeCheckInOut()
  	},
  	onChangeCheckInOut () {
  		if (this.checkin_out_date.length > 0) {
  			this.total_price_cal_blk = true
	  		let pre_date = this.checkin_out_date[0]
	  		let post_date = this.checkin_out_date[1]
	  		this.day_nights = Math.round((post_date - pre_date) / (1000 * 60 * 60 * 24))
	  		let room_price
	  		if(this.host.host_type === "Entire Place") {
	  			room_price = 15000
	  		}
	  		if(this.host.host_type === "Shared Room") {
	  			room_price = 7500
	  		}
	  		if(this.host.host_type === "Private Room") {
	  			room_price = 10000
	  		}
	  		this.total_guests_amount = room_price * this.guests_count


	  		this.total_amount = this.total_guests_amount * this.day_nights

	  		this.cleaning_fee = (this.total_amount/100) * 12.5
	  		this.service_fee = (this.total_amount/100) * 7.5
	  	}

  	},
  	onBooking () {
  		this.show_booking_details = false
  	},
  	onPaymentSuccess (res) {
  		console.log('payment success res @@@@@', res)
  	},
  	onPaymentFail (res) {
  		console.log('payment failed res ---------', res)
  	},
  	onPaymentAuthorized (res) {
  		console.log('payment authorized res ---------', res)
  	}
  },
  mounted () {
  	console.log('params', this.$route.params.id)
  	let host_id = { id : this.$route.params.id }
  	AppService.getSingleHome(host_id).then(res => {
      console.log('single host response', res.data.data)
      this.host_images = res.data.data.images
      this.map_coordinates = res.data.data.map_coordinates
      this.host = res.data.data
    })

    console.log('user status', localStorage.user)
    if (localStorage.user !== undefined) {
    	this.user_loggedin = true
    } else {
    	this.user_loggedin = false
    }
  },
  computed: {
  	
  },
  components: {
    HeaderComponent,
    FooterComponent,
    StarRating,
    DatePicker,
    PayPal
  }
}
</script>

<style scoped>
.values {
	text-align: right;
}
.head_component {
	background-color: #a4a77f;
}
.full_details_div {
	margin-right: 5%;
	margin-left: 5%;
	margin-top: 1%;
}
.map_blk {
	padding: 5px;
}
.details_blk {
	padding: 10px;
	background-color: #f1f3f0;
}
.details_ul li {
	list-style: none;
	padding: 5px;
}
.sleeping_head {
	font-weight: bold;
	margin-bottom: 2px;
}
.bed_img {
	width: 50px;
	opacity: 0.7;
	margin-right: 1%;
	border: 1px solid green;
	padding: 5px;
}
.price_tag {
	padding: 5px;
	font-weight: bold;
	background-color: #fff;
	border: 1px solid orange;
}
.m-b-none {
	margin-bottom: 0px;
}
.host_name {
	opacity: 0.8;
}
.owner_details_blk {
	background-color: #f2f2f2;
	padding: 1%;
}
/*.owner_details_blk span {
	float: right;
}*/
.owner_details_blk small {
	font-size: 18px;
}
.owner_details_blk span img {
	border-radius: 20px;
}
.review_rating_p {
	margin-bottom: 1%;
	margin-top: 1%;
}
.red-color {
	color: red;
}
.img-circle {
	border-radius: 50px;
}
.review_blk {
	padding: 2%;
	background-color: #f2f2f2;
	margin-top: 2px;
}
.quotes {
	font-size: 20px;
	opacity: 0.7;
	color: #de1b04;
}
.quoted_user {
	font-weight: bold;
	opacity: 0.8;
}
.book_now_btn {
	position: relative;
	top: -58px;
	float: right;
	border: 1px solid #fff;
}
.modal-footer {
	padding: 5px !important;
}
.beds_incre_btn {
	border-radius: 21px;
	padding: 0px;
	padding-left: 14px;
	padding-right: 11px;
	font-size: 25px;
	font-weight: bold;
}
.beds_decre_btn {
	border-radius: 28px;
	padding: 0px;
	padding-left: 16px;
	padding-right: 15px;
	font-size: 25px;
	font-weight: bold;
}
.taxes_div {
	margin-top: 2%;
}
.listing_details {
	border-bottom: 1px solid #fff;
	padding-bottom: 2%;
	opacity: 0.8;
	background-color: #ccc;
	padding: 2%;
}
.listing_details img {
	border-radius: 5px;
	border: 1px solid #fff;
}
.listing_details p {
	font-weight: bold;
	font-size: 14px;
}
.guests_blk {
	border-bottom: 1px solid #fff;
	padding-bottom: 2%;
	padding-top: 2%;
}
.check_inout_blk {
	border-bottom: 1px solid #fff;
	padding-bottom: 2%;
	padding-top: 2%;
}
.taxes_div .row {
	margin-top: 2% !important;
	margin-bottom: 2% !important;
	border-bottom: 1px solid #ccc;
}
.taxes_div span {
	color: #515050;
	font-size: 14px;
}
.total_row span {
	font-weight: bold;
}
.total_row {
	border-bottom: none !important;
}
</style>
