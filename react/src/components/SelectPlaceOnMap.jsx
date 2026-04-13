import Uppsala from '../assets/UppsalaKarta.png'

export function SelectPlaceOnMap() {


    return (
        <div className="map-component">
            <img src={Uppsala} alt="Map of Uppsala" className="map-image" />
            <button className="choose-location-button">
                Choose location
            </button>
        </div>
    )
}
