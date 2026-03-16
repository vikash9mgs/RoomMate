import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icon missing in React Leaflet
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const ListingMap = ({ listings }) => {
    const navigate = useNavigate();
    // Default center (Lucknow)
    const defaultCenter = [26.8467, 80.9462];
    const [map, setMap] = React.useState(null);

    React.useEffect(() => {
        if (map && listings.length > 0) {
            const bounds = L.latLngBounds(listings.map(l => [l.latitude || 26.8467, l.longitude || 80.9462]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [map, listings]);

    const handleViewDetails = (listingId) => {
        navigate(`/listing/${listingId}`);
    };

    return (
        <MapContainer
            center={defaultCenter}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
            ref={setMap}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {listings.map((listing) => {
                const lat = listing.latitude || (26.8467 + (Math.random() - 0.5) * 0.1);
                const lng = listing.longitude || (80.9462 + (Math.random() - 0.5) * 0.1);

                return (
                    <Marker key={listing._id} position={[lat, lng]}>
                        <Popup>
                            <div style={{ minWidth: '200px' }}>
                                <strong style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                                    {listing.title}
                                </strong>
                                <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                                    <strong>₹{listing.price}/mo</strong>
                                </div>
                                <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>
                                    {listing.type}
                                </div>
                                <div style={{ fontSize: '12px', color: '#888', marginBottom: '10px' }}>
                                    📍 {listing.location}
                                </div>
                                <button
                                    onClick={() => handleViewDetails(listing._id)}
                                    style={{
                                        width: '100%',
                                        padding: '8px 12px',
                                        backgroundColor: '#0d6efd',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '13px',
                                        fontWeight: '500',
                                    }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#0b5ed7'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = '#0d6efd'}
                                >
                                    View Details
                                </button>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
};

export default ListingMap;
