import ProbabilityWheel from "./ProbabilityWheel"

const EventUser = () => {
    const coupons=[
        {
            "id": 2,
            "name": "coupon2",
            "description": "132132",
            "code": "131234231",
            "discount": 31,
            "discount_type": "fixed",
            "winning_probability": 0.1,
            "probability_percentage": 100
        },
        {
            "id": 3,
            "name": "coupon3",
            "description": "2313",
            "code": "1233",
            "discount": 1233,
            "discount_type": "percentage",
            "winning_probability": 0.1,
            "probability_percentage": 1
        },
        {
            "id": 3,
            "name": "coupon4",
            "description": "2313",
            "code": "1233",
            "discount": 12333,
            "discount_type": "percentage",
            "winning_probability": 0.1,
            "probability_percentage": 0
        },
        {
            "id": 4,
            "name": "coupon5",
            "description": "2313",
            "code": "1233",
            "discount": 12333,
            "discount_type": "percentage",
            "winning_probability": 0.1,
            "probability_percentage": 0
        },
        
    ]
  return (
    <div>
        <ProbabilityWheel coupons={coupons} />
    </div>
  )
}

export default EventUser