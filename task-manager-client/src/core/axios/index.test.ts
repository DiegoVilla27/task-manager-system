import { environment } from "@core/environments";
import axios from "axios";

describe('Axios Configuration', () => {
  it('should configure axios correctly', async () => {
    // Arrange
    vi.spyOn(axios, 'create');
    // Act
    const { axiosInstance } = await import('@core/axios');
    // Assert
    expect(axios.create).toHaveBeenCalled();
    expect(axiosInstance.defaults.baseURL).toBe(environment.apiUrl);
    expect(axiosInstance.defaults.timeout).toBe(10000);
  });
});