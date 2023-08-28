import { source } from "common-tags"
import { getMethodTypeNameMapper } from "@/codegen/getMethodTypeNameMapper"

export function generateMethodFile(method: string) {
	const getMethodTypeName = getMethodTypeNameMapper(method)

	const variableType = getMethodTypeName("Variables")
	const dataType = getMethodTypeName("Data")

	const result = source`
		package controller

		import (
			"encoding/json"
			"net/http"

			"github.com/labstack/echo/v4"
			"github.com/pangpanglabs/echoswagger/v2"
			"github.com/s21toolkit/s21client/requests"
		)

		func init() {
			registerMethod(func(g echoswagger.ApiGroup, c *AdapterController) {
				g.POST("/${method}", c.Handle_${method}).
					AddParamBody(requests.${variableType}{}, "variables", "Request variables", true).
					AddResponse(http.StatusOK, "Success", requests.${dataType}{}, nil)
			})
		}

		func (a *AdapterController) Handle_${method}(c echo.Context) (err error) {
			var data struct {
				Variables requests.${variableType} \`json:"variables"\`
			}

			err = json.NewDecoder(c.Request().Body).Decode(&data)

			if err != nil {
				return
			}

			res, err := a.client.R().${method}(data.Variables)

			if err != nil {
				return
			}

			return c.JSON(http.StatusOK, res)
		}
	`

	return result
}
