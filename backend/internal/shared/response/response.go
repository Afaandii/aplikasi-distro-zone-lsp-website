package response

import (
	"encoding/json"
	"net/http"
)

// WriteJSON is a helper to write JSON responses
func WriteJSON(w http.ResponseWriter, status int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}
